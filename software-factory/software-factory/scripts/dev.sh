#!/usr/bin/env bash
set -euo pipefail
export PYTHONPATH="$(pwd)"

run_tests() {
  python -m pytest -q
}

run_red() {
  python scripts/factory.py red >/dev/null
}

if [[ "${1:-}" == "--watch" ]]; then
  echo "Starting watch mode... (Ctrl+C to stop)"
  while true; do
    run_red
    run_tests || true
    sleep 2
  done
else
  run_red
  run_tests
fi


