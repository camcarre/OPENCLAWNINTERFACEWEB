# SSHOPENCLAWN - Usine Multi-Agents IA

Ce projet gère une infrastructure de 13 agents IA autonomes sur un VPS distant.

## 📂 Structure du Projet

- **`/config`** : Fichiers de configuration (`openclaw.json`) et secrets.
- **`/deployments`** : Scripts de déploiement vers le VPS (`deploy_v3.sh`).
- **`/governance`** : Définition des identités (`IDENTITY.md`) et des comportements (`SOUL.md`) du Manager et des Workers.
- **`/scripts`** :
    - `/triage` : Moteur de décision sémantique du Manager.
    - `/tools` : Outils DIY (validateur de code, db manager, etc.).
- **`/security`** : Clés SSH privées pour l'accès au VPS.

## 🚀 Déploiement

Pour envoyer toute la configuration et la gouvernance vers le VPS :
```bash
bash deployments/deploy_v3.sh
```

## 🛠️ Maintenance

- **Santé système** : Lance le script de santé via le Manager sur Telegram (/health).
- **Consommation** : Vérifie l'usage des tokens via (/usage).
