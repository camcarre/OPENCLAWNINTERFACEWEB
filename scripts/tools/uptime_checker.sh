#!/bin/bash
# Check all workers workspaces integrity

WORKERS=("code-writer" "code-reviewer" "researcher" "analyst" "browser-agent" "writer" "messenger" "foundry" "capability-evolver" "smart-home" "clawwork" "heartbeat-agent")

echo "=== SYSTEM INTEGRITY CHECK ==="
for worker in "${WORKERS[@]}"; do
    PATH="/data/.openclaw/workspace-worker-$worker"
    if [ -d "$PATH" ]; then
        echo "[OK] $worker exists."
        ls "$PATH" | wc -l | xargs echo "Files count:"
    else
        echo "[ERROR] $worker MISSING!"
    fi
done
