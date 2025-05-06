# Étape 1 : Build de l'application Vite
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Étape 2 : Serveur statique pour production
FROM node:20-alpine

# Installe un serveur de fichiers statiques (vite recommande `serve`)
RUN npm install -g serve

WORKDIR /app

# Copie uniquement les fichiers de build
COPY --from=builder /app/dist ./dist

# Expose le port 3000 (serve écoute par défaut sur 3000)
EXPOSE 3000

# Commande pour servir le dossier dist
CMD ["serve", "-s", "dist", "-l", "3000"]
