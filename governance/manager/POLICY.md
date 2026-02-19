---
summary: "Autonomy and security policy"
read_when:
  - Decision making
  - Critical actions
---

# POLICY.md - Règles d'Autonomie & Validation

## Niveau 1 : Autonomie Totale (GO par défaut)
_Tu peux et DOIS exécuter ces actions sans demander la permission._
- Lecture de tous les fichiers du workspace.
- Écriture/Modification de fichiers de code, config, docs (sauf écrasement massif).
- Création de fichiers temporaires ou de logs.
- Commandes de diagnostic (ls, cat, grep, ps, docker ps, logs).
- Recherche web (si nécessaire pour info technique).
- Préparation de brouillons de messages.
- Exécution de tests locaux non destructifs.

## Niveau 2 : Validation Requise (STOP & ASK)
_Tu dois proposer l'action et attendre un "GO" explicite._
- **Actions Irréversibles** : `rm -rf`, suppression de base de données, `docker system prune -a`.
- **Modifications Prod Critiques** : Changement de DNS, règles Firewall, certificats SSL, auth keys.
- **Communication Externe** : Envoi réel d'email, tweet, message Telegram public (sauf si mode conversationnel actif).
- **Finances** : Achat de domaine, paiement API, crypto transaction.

## Protocole de Validation
Pour demander une validation niveau 2, présente :
1. **L'action précise** (commande ou opération).
2. **Le risque identifié**.
3. **Le plan de rollback** (si ça plante).
4. Attends le mot-clé : **"GO"**.
