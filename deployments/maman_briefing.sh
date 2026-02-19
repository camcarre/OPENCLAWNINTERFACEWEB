#!/bin/bash
# Briefing automatique pour Maman (8h00)

echo "=== GENERATING MORNING BRIEFING FOR MAMAN ==="
# On demande au Researcher de préparer les infos
# Puis au Messenger d'envoyer via le bot Telegram

# Commande simulée pour le Manager
# "Task: Researcher trouve meteo et actu locale. Messenger envoie a Maman."
ssh -i security/keys/id_ed25519_openclawn root@76.13.32.171 "docker exec ec264ae4176e sh -c "echo 'BRIEFING_MAMAN_8AM' > /data/.openclaw/workspace/shared/trigger_maman.txt""
