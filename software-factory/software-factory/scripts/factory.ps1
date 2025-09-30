param([Parameter(Mandatory = $true)][ValidateSet('plan','red','green','verify','docs','build')][string]$Cmd,
      [string]$Project,
      [string]$FromDocs,
      [string]$Tickets,
      [string]$Out)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$env:PYTHONPATH = (Get-Location)

$argsList = @('scripts/factory.py', $Cmd)
if ($Project) { $argsList += @('--project', $Project) }
if ($FromDocs) { $argsList += @('--from-docs', $FromDocs) }
if ($Tickets) { $argsList += @('--tickets', $Tickets) }
if ($Out) { $argsList += @('--out', $Out) }

python @argsList


