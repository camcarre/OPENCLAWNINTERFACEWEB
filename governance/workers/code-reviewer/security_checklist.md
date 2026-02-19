# SECURITY CHECKLIST (Code Review)

L'agent doit valider ces points avant tout retour au Manager :

1. **Secrets** : Aucune clé API, mot de passe ou token en clair.
2. **Entrées** : Validation systématique des entrées utilisateur pour éviter les injections.
3. **Permissions** : Le script utilise-t-il les droits minimaux nécessaires ?
4. **Cas limites** : Gestion des erreurs (try/catch) et cas vides.
5. **Dette technique** : Le code est-il lisible et commenté ?
6. **Ressources** : Pas de boucles infinies ou de consommation RAM excessive.
