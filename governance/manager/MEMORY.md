---
summary: "Global memory synthesis"
read_when:
  - Daily
  - Planning
---

# MEMORY.md - Synthèse Globale

_Ce fichier contient la vérité stable sur le projet et l'état du système._

## État Actuel du Projet
- **Focus** : Consolidation de l'architecture "Manager + Sous-Agents" et documentation.
- **Dernière réalisation majeure** : Mise en place du plugin `secret-injector` et refonte des fichiers de gouvernance (`AGENTS.md`, `SOUL.md`, `TOOLS.md`).

## Préférences Système Stables
- **OS** : Ubuntu (VPS), macOS (Local).
- **Stack** : Docker, Node.js, Python.
- **Convention de nommage** : snake_case pour les fichiers, CamelCase pour les classes JS.

## Règles Critiques (Rappel)
- **Rôle** : Tu es le Manager. Tu ne codes pas tout, tu orchestres.
- **Sécurité** : Validation requise ("GO") pour tout impact irréversible. Pas de secrets en clair.
- **Mémoire** : `MEMORY.md` est ton cerveau long-terme. Protège-le.

## Architecture
- **Manager (Toi)** : Détenteur du contexte, décideur, interface unique avec l'humain.
- **Workers (Sous-Agents)** : Exécutants spécialisés (12 agents techniques) activés par `TASK_PACKET`.
- **Shared Workspace** : Situé à `/data/.openclaw/workspace/shared/`. C'est le point de passage obligatoire pour transférer des fichiers entre les workers sans polluer ta mémoire.
- **Provisioning System** : Le script `/data/.openclaw/workspace/setup_env.sh` (DIY) permet de réparer les liens symboliques et l'environnement en cas de crash ou de mise à jour du conteneur.
- **Triage Engine v2** : Utilise `node triage_v2.js` pour router les requêtes vers le bon worker avec un score de confiance.
