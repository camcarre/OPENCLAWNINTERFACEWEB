# 🚀 MISSION CONTROL

Ce fichier est le tableau de bord de notre opération sur le VPS.
Il résume **où** nous sommes connectés, **ce que** nous avons construit, et **comment** interagir avec le système.

## 📡 Connexion & Cible

Les scripts de `actions/` se connectent automatiquement à cette infrastructure :

- **Serveur VPS** : `76.13.32.171` (User: `root`)
- **Cible Docker** : Conteneur `a383c8ebd917` (OpenClaw)
- **Point de Montage** : `/data/.openclaw`

> *Note : Les identifiants sont centralisés dans `ssh_playground/settings.tcl`.*

---

## ✅ Ce qui est Fait (Log des Réalisations)

Nous avons transformé une installation OpenClaw basique en une architecture multi-agents sophistiquée.

### 1. Architecture "Manager & Workers" 🧠
Nous avons mis en place une hiérarchie stricte mais efficace :
- **Manager (L'Interface)** : Le seul agent qui te parle. Il orchestre tout.
- **Workers (Les Spécialistes)** : Des sous-agents avec des rôles et des dossiers dédiés.
    - 🔍 **Research** : Recherche et synthèse.
    - 💻 **Dev** : Code et technique.
    - 🧪 **QA** : Tests et critique.
    - 🛡️ **Ops** : Déploiement et sécurité.

### 2. Gouvernance Déployée 📜
Chaque agent a reçu son "Âme" et ses instructions via des fichiers `.md` spécifiques :
- **Manager** : `/data/.openclaw/workspace/` (Cerveau central)
- **Workers** : `/data/.openclaw/workspace-worker-*/` (Espaces de travail isolés)
    - Chaque worker a son propre `IDENTITY.md` et `SOUL.md`.
    - Ils partagent les outils (`TOOLS.md`) et la politique (`POLICY.md`).

### 3. Outils & Plugins 🛠️
- **Secret Injector** : Plugin développé et déployé pour gérer les secrets en sécurité.
- **Ton de l'Agent** : Ajusté pour être "Complice Proactif" (moins robotique, plus partenaire).
- **Scripts d'Automatisation** : Une suite de scripts `expect` pour tout gérer sans toucher au terminal SSH manuellement.

---

## 🛠️ Actions Disponibles (Dossier `actions/`)

Utilise ces scripts pour interagir avec le système. Je peux les lancer pour toi.

| Script | Description |
| :--- | :--- |
| **`0_exec_on_vps.exp`** | Exécuter une commande directement sur le VPS (host). |
| **`1_view_logs.exp`** | Voir les logs du conteneur (filtrables). |
| **`2_exec_in_container.exp`** | Exécuter une commande shell DANS le conteneur. |
| **`3_upload_to_container.exp`** | Envoyer un fichier local unique vers le conteneur. |
| **`4_download_from_container.exp`** | Récupérer un fichier du conteneur. |
| **`5_download_all_md.exp`** | Sauvegarder tous les fichiers `.md` (mémoire, notes) en local. |
| **`6_upload_governance.exp`** | **CRITIQUE**. Déploie toute la structure (Manager + Workers) et redémarre l'IA. |
| **`7_restart_container.exp`** | Redémarrage simple du conteneur Docker. |

## 🎯 Prochaines Étapes
- [ ] Surveiller les logs pour voir les workers en action.
- [ ] Affiner les prompts des workers si nécessaire.
