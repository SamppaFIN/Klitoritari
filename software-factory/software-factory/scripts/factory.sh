#!/usr/bin/env bash
set -euo pipefail
export PYTHONPATH="$(pwd)"

if [[ $# -lt 1 ]]; then
  echo "Usage: scripts/factory.sh <plan|red|green|verify|docs|build> [--project NAME] [--from-docs GLOB] [--tickets DIR] [--out DIR]" >&2
  exit 1
fi

python scripts/factory.py "$@"


