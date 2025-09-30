param(
  [switch]$Watch
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$env:PYTHONPATH = (Get-Location)

function Run-Tests {
  python -m pytest -q
}

function Run-Red {
  python scripts/factory.py red | Out-Null
}

if ($Watch) {
  Write-Host "Starting watch mode... (Ctrl+C to stop)" -ForegroundColor Green
  while ($true) {
    Run-Red
    Run-Tests
    Start-Sleep -Seconds 2
  }
} else {
  Run-Red
  Run-Tests
}


