#!/bin/bash

# Token 用量监控脚本
# 当用量超过阈值时发送提醒

THRESHOLD_PERCENT=80  # 用量达到 80% 时提醒
WORKSPACE="/home/admin/.openclaw/workspace"
STATE_FILE="$WORKSPACE/memory/token-monitor-state.json"

# 获取当前 session 状态
STATUS=$(openclaw status 2>&1)

# 提取 token 信息 (格式：🧮 Tokens: XXX in / YYY out)
TOKEN_LINE=$(echo "$STATUS" | grep "🧮 Tokens:")

if [ -z "$TOKEN_LINE" ]; then
    echo "无法获取 token 信息"
    exit 1
fi

# 解析输入 token 数
INPUT_TOKENS=$(echo "$TOKEN_LINE" | sed -n 's/.*🧮 Tokens: \([0-9kM]*\) in.*/\1/p')

# 转换 k/M 为数字
convert_to_number() {
    local val=$1
    if [[ $val == *k ]]; then
        echo $(echo $val | sed 's/k//' | awk '{print int($1 * 1000)}')
    elif [[ $val == *M ]]; then
        echo $(echo $val | sed 's/M//' | awk '{print int($1 * 1000000)}')
    else
        echo $val
    fi
}

INPUT_NUM=$(convert_to_number "$INPUT_TOKENS")

# 假设限额 (根据实际模型调整)
# qwen3.5-plus 的 context limit 是 1M tokens
LIMIT=1000000

# 计算使用百分比
PERCENT=$((INPUT_NUM * 100 / LIMIT))

# 读取上次提醒状态
LAST_ALERT=0
if [ -f "$STATE_FILE" ]; then
    LAST_ALERT=$(cat "$STATE_FILE" | grep -o '"last_alert_percent":[0-9]*' | cut -d':' -f2)
fi

# 如果超过阈值且之前没提醒过，发送消息
if [ $PERCENT -ge $THRESHOLD_PERCENT ] && [ $LAST_ALERT -lt $THRESHOLD_PERCENT ]; then
    # 发送提醒消息到 feishu
    openclaw message send --channel feishu --target "ou_752adc65e1cc65e1cc6564f05a7f86daa10c95" \
        "⚠️ Token 用量提醒：当前已使用 ${PERCENT}% (${INPUT_NUM}/${LIMIT} tokens)\n\n建议尽快切换到大容量模型或开始新会话"
    
    # 更新状态
    echo "{\"last_alert_percent\": $PERCENT, \"timestamp\": $(date +%s)}" > "$STATE_FILE"
    echo "已发送提醒：${PERCENT}%"
else
    echo "当前用量：${PERCENT}% - 无需提醒"
fi
