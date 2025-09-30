#!/usr/bin/env bash
set -euo pipefail
export PYTHONPATH="$(pwd)"
PROJECT="${FACTORY_PROJECT_NAME:-autonomous-factory}"
python scripts/factory.py build --project "$PROJECT"

