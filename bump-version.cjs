#!/usr/bin/env node
const fs    = require('fs');
const path  = require('path');
const semver = require('semver');

// Chargement du package.json
const pkgPath = path.resolve(__dirname, 'package.json');
const pkg     = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const current = pkg.version;

// Récupérer la branche source de la PR
// Dans GitHub Actions, GITHUB_HEAD_REF est défini pour les pull_request
const branch = process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME || '';

// Choix du bump
let next;
if (/^feat\//.test(branch)) {
  next = semver.inc(current, 'minor');
} else if (/^fix\//.test(branch)) {
  next = semver.inc(current, 'patch');
} else if (/breaking/.test(branch)) {
  next = semver.inc(current, 'major');
} else {
  console.log('No version bump for branch:', branch);
  process.exit(0);
}

// Mise à jour de la version
pkg.version = next;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

console.log(next);  // Affiche la nouvelle version pour GitHub Actions
