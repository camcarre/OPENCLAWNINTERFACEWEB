#!/bin/bash
# Script de déploiement V4 - Structure Propre
# SSH Host: 76.13.32.171 | Docker: openclaw-kg4d-openclaw-1

KEY="security/keys/id_ed25519_openclawn"
CONFIG="config/openclaw.json"
MANAGER_GOV="governance/manager"
WORKERS_GOV="governance/workers"
CONTAINER="openclaw-kg4d-openclaw-1"

# 1. Upload de la config JSON
echo "Uploading configuration..."
expect -c "spawn scp -i $KEY -o StrictHostKeyChecking=no $CONFIG root@76.13.32.171:/tmp/openclaw.json; expect eof"
ssh -i $KEY root@76.13.32.171 "docker cp /tmp/openclaw.json $CONTAINER:/data/.openclaw/openclaw.json && rm /tmp/openclaw.json"

# 2. Upload de Manager
echo "Uploading Manager governance..."
expect -c "spawn scp -i $KEY -o StrictHostKeyChecking=no -r $MANAGER_GOV root@76.13.32.171:/tmp/manager; expect eof"
ssh -i $KEY root@76.13.32.171 "docker cp /tmp/manager/. $CONTAINER:/data/.openclaw/workspace/ && rm -rf /tmp/manager"

# 3. Upload des Workers
WORKERS=("code-writer" "code-reviewer" "researcher" "analyst" "browser-agent" "writer" "messenger" "foundry" "capability-evolver" "smart-home" "clawwork" "heartbeat-agent")

for worker in "${WORKERS[@]}"; do
    echo "Deploying worker: $worker..."
    # On envoie les fichiers MD de gouvernance
    expect -c "spawn scp -i $KEY -o StrictHostKeyChecking=no -r $WORKERS_GOV/$worker root@76.13.32.171:/tmp/$worker; expect eof"
    ssh -i $KEY root@76.13.32.171 "docker exec $CONTAINER mkdir -p /data/.openclaw/workspace-worker-$worker && \
    docker cp /tmp/$worker/IDENTITY.md $CONTAINER:/data/.openclaw/workspace-worker-$worker/IDENTITY.md && \
    docker cp /tmp/$worker/SOUL.md $CONTAINER:/data/.openclaw/workspace-worker-$worker/SOUL.md && \
    docker exec $CONTAINER cp /data/.openclaw/workspace/TOOLS.md /data/.openclaw/workspace-worker-$worker/TOOLS.md && \
    docker exec $CONTAINER cp /data/.openclaw/workspace/POLICY.md /data/.openclaw/workspace-worker-$worker/POLICY.md && \
    rm -rf /tmp/$worker"
done

# 4. Upload & Restart Status Server
echo "Deploying Status Server..."
expect -c "spawn scp -i $KEY -o StrictHostKeyChecking=no scripts/tools/status-server.js root@76.13.32.171:/tmp/status-server.js; expect eof"
ssh -i $KEY root@76.13.32.171 "docker cp /tmp/status-server.js $CONTAINER:/data/.openclaw/workspace/status-server.js && \
docker exec -d $CONTAINER node /data/.openclaw/workspace/status-server.js && \
rm /tmp/status-server.js"

# 5. Restart & Health
echo "Restarting OpenClaw..."
ssh -i $KEY root@76.13.32.171 "docker restart $CONTAINER && sleep 2 && docker exec $CONTAINER /data/.openclaw/workspace/scripts/openclaw-health.sh"

echo "Deployment finished."
