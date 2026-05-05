#!/bin/bash
# Hourly memory update script
# Updates the current progress in the memory file so next session knows where we left off

MEMORY_FILE="/root/.openclaw/workspace/memory/2026-05-05.md"
TASK_FILE="/root/.openclaw/workspace/localboost/TASK_BACKLOG.md"
LOG_FILE="/root/.openclaw/workspace/localboost/logs/hourly_progress.log"

echo "=== Memory Update: $(date) ===" >> "$LOG_FILE"

# Update memory with current progress
cat >> "$MEMORY_FILE" << 'EOF'

## Hourly Update: $(date)
EOF

# Check git status
cd /root/.openclaw/workspace/localboost
echo "Git status: $(git status --short 2>/dev/null)" >> "$LOG_FILE"
echo "Uncommitted changes: $(git diff --stat 2>/dev/null | tail -1)" >> "$LOG_FILE"

# Check if build passes
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "Build: PASS ✅" >> "$LOG_FILE"
else
    echo "Build: FAIL ❌" >> "$LOG_FILE"
fi

echo "Memory updated at $(date)" >> "$LOG_FILE"
echo "---" >> "$LOG_FILE"
