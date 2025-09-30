Param(
  [string]$Project = $env:FACTORY_PROJECT_NAME
)

$ErrorActionPreference = 'Stop'
$env:PYTHONPATH = (Get-Location)
python scripts/factory.py build --project $Project

