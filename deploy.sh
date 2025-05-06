#!/bin/bash

set -e

ENV="$1"

if [[ "$ENV" != "prod" && "$ENV" != "pre-prod" ]]; then
  echo "❌ Environnement invalide : $ENV"
  exit 1
fi

APP_PATH="$ENV"
cd "$APP_PATH"

DOMAIN="like-it.coak.fr"
IMAGE_TAG="prod"
NGINX_PORT=3000

if [[ "$ENV" == "pre-prod" ]]; then
  DOMAIN="like-it-pre-prod.coak.fr"
  IMAGE_TAG="pre-prod"
  NGINX_PORT=3001
fi

EMAIL="baptiste.ferrand.pro@outlook.fr"
CERT_PATH="/etc/letsencrypt/live/$DOMAIN/fullchain.pem"
SOURCE_CONF="./nginx/front.conf"
TARGET_CONF="/etc/nginx/sites-available/front-$ENV.conf"
ENABLED_LINK="/etc/nginx/sites-enabled/front-$ENV.conf"

echo "🔐 === [1/5] Vérification du certificat SSL pour $DOMAIN ==="

if [ ! -f "$CERT_PATH" ]; then
    echo "-> Certificat non trouvé, création avec Certbot..."
    sudo certbot certonly --nginx -d "$DOMAIN" --non-interactive --agree-tos -m "$EMAIL"

    if [ $? -ne 0 ]; then
        echo "❌ Échec de la génération du certificat SSL. Abandon du déploiement."
        exit 1
    fi

    echo "-> Mise en place du renouvellement automatique..."
    if ! crontab -l | grep -q "certbot renew"; then
        (crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet && systemctl reload nginx") | crontab -
    fi

    echo "-> Redémarrage de Nginx avec le nouveau certificat..."
    sudo systemctl reload nginx
else
    echo "-> Certificat trouvé."
    echo "🔁=== [2/5] Vérification du renouvellement automatique..."
    if ! crontab -l | grep -q "certbot renew"; then
        echo "-> Ajout du renouvellement auto..."
        (crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet && systemctl reload nginx") | crontab -
    fi
fi

echo "📦 === [3/5] Configuration Nginx ==="
echo "-> Génération de la config avec envsubst..."

export DOMAIN NGINX_PORT
envsubst '$DOMAIN $NGINX_PORT' < "$SOURCE_CONF" > /tmp/nginx-front-temp.conf
sudo cp /tmp/nginx-front-temp.conf "$TARGET_CONF"

if [ -L "$ENABLED_LINK" ] && [ ! -e "$ENABLED_LINK" ]; then
    echo "-> Nettoyage lien symbolique cassé"
    sudo rm "$ENABLED_LINK"
fi

if [ ! -L "$ENABLED_LINK" ]; then
    echo "-> Activation de la config Nginx (enable)"
    sudo ln -s "$TARGET_CONF" "$ENABLED_LINK"
fi

sudo nginx -t
sudo systemctl reload nginx

echo "🐳 === [4/5] Déploiement Docker Compose ==="
docker compose down
docker compose up --build -d

echo "🎉 === [5/5] Déploiement $ENV terminé avec succès ✅"
