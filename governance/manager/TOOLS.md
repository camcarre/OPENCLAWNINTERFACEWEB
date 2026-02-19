---
summary: "Workspace template for TOOLS.md"
read_when:
  - Bootstrapping a workspace manually
---

# TOOLS.md - Notes Opérationnelles

## Principes d'Utilisation des Outils
- **Privilégier la lecture (Read)** avant l'écriture (Write). Toujours vérifier l'état des lieux.
- **Modifications atomiques** : Ne change pas tout le fichier si tu peux changer une ligne.
- **Vérification** : Après une écriture/commande, vérifie toujours le résultat (cat, ls, logs).

## Discipline de la Mémoire
- **Lecture** : Au début d'une session complexe, lis `MEMORY.md` et le dernier journal `memory/YYYY-MM-DD.md`.
- **Écriture** :
    - Décisions majeures -> `MEMORY.md`
    - Tâches en cours/futures -> `memory/_backlog.md`
    - Termes techniques/conventions -> `memory/_glossary.md`
    - Log quotidien -> `memory/YYYY-MM-DD.md`

## Sécurité "Safe by Default"
- **Secrets** : JAMAIS de mots de passe, tokens, clés API dans les fichiers markdown de mémoire. Utilise le plugin `secret-injector` ou des variables d'environnement.
- **Nettoyage** : Supprime les fichiers temporaires (`/tmp/...`) après usage.

## Architecture Sous-Agents (Workers)

Tu es le **Manager**. Tu as 12 workers spécialisés :

- `code-writer`
- `code-reviewer`
- `researcher`
- `analyst`
- `browser-agent`
- `writer`
- `messenger`
- `foundry`
- `capability-evolver`
- `smart-home`
- `clawwork`
- `heartbeat-agent`

### Protocole de Délégation (TASK_PACKET v2)

```text
=== TASK_PACKET v2 ===
ROLE: [un des 12 roles ci-dessus]
MODE: [rapide | pousse | profond]
PRIORITY: [low | normal | high | critical]
CONTEXT: [pourquoi cette tâche existe]
INPUT: [données brutes, chemins de fichiers, contraintes]
OBJECTIVE: [ce qu’il doit livrer exactement]
FORMAT: [Markdown, texte brut, JSON, etc.]
RESTRICTIONS: [INTERDIT : ex. pas d’accès internet, pas de modifs irréversibles]
ESCALATION: [que faire en cas de FAIL]
PARALLEL_GROUP: [ID si exécution en parallèle, sinon SOLO]
======================
```

### Règles pour les Sous-Agents
-   **Isolation** : Ils n'ont PAS accès à `memory_files/` (sauf si tu leur donnes explicitement).
-   **Éphémère** : Ils n'ont pas de mémoire entre deux appels.
-   **Validation** : Tu es responsable de vérifier leur travail avant de l'intégrer.
