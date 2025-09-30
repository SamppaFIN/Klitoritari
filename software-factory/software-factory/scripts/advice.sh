#!/usr/bin/env bash
set -euo pipefail

# Load .env if present
if [[ -f .env ]]; then
  # shellcheck disable=SC2046
  export $(grep -v '^[#;]' .env | xargs -0 -I{} bash -c 'echo {}' 2>/dev/null || true)
fi

MODEL="${OPENROUTER_MODEL:-openai/gpt-4o-mini}"
BASE="${OPENROUTER_BASE:-https://openrouter.ai/api/v1}"
REFERER="${HTTP_REFERER:-https://local.dev}"
TITLE="${X_TITLE:-Autonomous Factory Advice}"

if [[ -z "${OPENROUTER_API_KEY:-}" ]]; then
  echo "OPENROUTER_API_KEY is not set" >&2
  exit 2
fi

usage() {
  echo "Usage: scripts/advice.sh -m 'your message' [-s 'system'] [-M model]" >&2
}

MSG=""
SYS=""
while getopts ":m:s:M:" opt; do
  case $opt in
    m) MSG="$OPTARG" ;;
    s) SYS="$OPTARG" ;;
    M) MODEL="$OPTARG" ;;
    *) usage; exit 1 ;;
  esac
done

if [[ -z "$MSG" ]]; then
  usage; exit 1
fi

BODY=$(jq -n \
  --arg model "$MODEL" \
  --arg user "$MSG" \
  --arg sys "$SYS" '
  {
    model: $model,
    messages: ([ if $sys != "" then {role:"system", content:$sys} else empty end ] +
               [ {role:"user", content:$user} ])
  }
')

curl -sS -X POST "$BASE/chat/completions" \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "HTTP-Referer: $REFERER" \
  -H "X-Title: $TITLE" \
  -H 'Content-Type: application/json' \
  -d "$BODY" | jq -r '.choices[0].message.content // "(no content)"'


