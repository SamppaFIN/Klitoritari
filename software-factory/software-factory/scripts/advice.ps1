param(
    [Parameter(Mandatory = $true)][string]$Message,
    [string]$System = "",
    [string]$Model = $env:OPENROUTER_MODEL
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Import-EnvFile {
    param([string]$Path = ".env")
    if (Test-Path $Path) {
        Get-Content $Path | ForEach-Object {
            if ($_ -match '^[#;]') { return }
            if ([string]::IsNullOrWhiteSpace($_)) { return }
            $parts = $_ -split '=', 2
            if ($parts.Length -eq 2) {
                $key = $parts[0].Trim()
                $val = $parts[1].Trim()
                if (-not [string]::IsNullOrWhiteSpace($key)) {
                    [Environment]::SetEnvironmentVariable($key, $val, 'Process') | Out-Null
                }
            }
        }
    }
}

Import-EnvFile

if (-not $Model -or [string]::IsNullOrWhiteSpace($Model)) {
    $Model = 'openai/gpt-4o-mini'
}

$apiKey = $env:OPENROUTER_API_KEY
if (-not $apiKey) { Write-Error "OPENROUTER_API_KEY is not set" }
$base = if ($env:OPENROUTER_BASE) { $env:OPENROUTER_BASE } else { 'https://openrouter.ai/api/v1' }
$referer = if ($env:HTTP_REFERER) { $env:HTTP_REFERER } else { 'https://local.dev' }
$title = if ($env:X_TITLE) { $env:X_TITLE } else { 'Autonomous Factory Advice' }

$uri = "$base/chat/completions"

$headers = @{
    Authorization = "Bearer $apiKey"
    "HTTP-Referer" = $referer
    "X-Title" = $title
    "Content-Type" = 'application/json'
}

$messages = @()
if ($System -and -not [string]::IsNullOrWhiteSpace($System)) {
    $messages += @{ role = 'system'; content = $System }
}
$messages += @{ role = 'user'; content = $Message }

$bodyObj = @{ model = $Model; messages = $messages }
$bodyJson = $bodyObj | ConvertTo-Json -Depth 6

try {
    $resp = Invoke-RestMethod -Method Post -Uri $uri -Headers $headers -Body $bodyJson
    if ($resp.choices -and $resp.choices.Count -gt 0) {
        $content = $resp.choices[0].message.content
        $content
    } else {
        Write-Error "No choices returned from OpenRouter"
    }
} catch {
    Write-Error $_
}


