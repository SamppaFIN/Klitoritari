# PowerShell script to test the application and get client-side logs via API
Write-Host "Starting error testing with client-side logs..." -ForegroundColor Green

# Function to get debug logs from the API
function Get-DebugLogsFromAPI {
    Write-Host "🔍 Getting debug logs from API..." -ForegroundColor Yellow
    
    try {
        # First, try to get logs from the API endpoint
        $response = Invoke-RestMethod -Uri "http://localhost:8000/api/debug-logs" -Method GET -ContentType "application/json"
        
        if ($response -and $response.logs) {
            Write-Host "✅ Successfully retrieved debug logs from API" -ForegroundColor Green
            Write-Host "📊 Total logs: $($response.logs.Count)" -ForegroundColor Cyan
            return $response
        } else {
            Write-Host "⚠️ No logs available yet, trying to trigger log collection..." -ForegroundColor Yellow
            
            # Try to open the page to trigger log collection
            Start-Process "http://localhost:8000" -WindowStyle Hidden
            Start-Sleep -Seconds 5
            
            # Try again
            $response = Invoke-RestMethod -Uri "http://localhost:8000/api/debug-logs" -Method GET -ContentType "application/json"
            
            if ($response -and $response.logs) {
                Write-Host "✅ Successfully retrieved debug logs after page load" -ForegroundColor Green
                Write-Host "📊 Total logs: $($response.logs.Count)" -ForegroundColor Cyan
                return $response
            } else {
                Write-Host "❌ Still no logs available" -ForegroundColor Red
                return $null
            }
        }
    } catch {
        Write-Host "❌ Error getting debug logs from API: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Function to analyze logs for errors
function Test-ForErrors {
    param($logData)
    
    if (-not $logData -or -not $logData.logs) {
        Write-Host "❌ No log data to analyze" -ForegroundColor Red
        return $false
    }
    
    $errorPatterns = @(
        "ReferenceError",
        "TypeError", 
        "SyntaxError",
        "Error:",
        "Failed to",
        "Cannot read properties",
        "is not a function",
        "already initialized",
        "not defined",
        "Uncaught",
        "Exception"
    )
    
    $errors = @()
    $logData.logs | ForEach-Object {
        $log = $_
        $message = if ($log.message) { $log.message } else { $log }
        
        foreach ($pattern in $errorPatterns) {
            if ($message -match $pattern) {
                $errors += @{
                    Pattern = $pattern
                    Message = $message
                    Timestamp = if ($log.timestamp) { $log.timestamp } else { "Unknown" }
                    Type = if ($log.type) { $log.type } else { "Unknown" }
                }
            }
        }
    }
    
    if ($errors.Count -gt 0) {
        Write-Host "`n❌ Found $($errors.Count) errors:" -ForegroundColor Red
        $errors | ForEach-Object {
            Write-Host "  - [$($_.Type)] $($_.Pattern): $($_.Message)" -ForegroundColor Red
        }
        return $true
    } else {
        Write-Host "`n✅ No errors found in logs" -ForegroundColor Green
        return $false
    }
}

# Function to check for specific issues
function Test-ForSpecificIssues {
    param($logData)
    
    if (-not $logData -or -not $logData.logs) {
        return @()
    }
    
    $issues = @()
    
    # Check for MapEngine issues
    $mapEngineLogs = $logData.logs | Where-Object { $_.message -match "MapEngine" }
    if ($mapEngineLogs.Count -eq 0) {
        $issues += "No MapEngine logs found - MapEngine may not be initializing"
    }
    
    # Check for MapObjectManager issues
    $mapObjectManagerLogs = $logData.logs | Where-Object { $_.message -match "MapObjectManager" }
    if ($mapObjectManagerLogs.Count -eq 0) {
        $issues += "No MapObjectManager logs found - MapObjectManager may not be initializing"
    }
    
    # Check for base creation issues
    $baseLogs = $logData.logs | Where-Object { $_.message -match "base" -or $_.message -match "Base" }
    if ($baseLogs.Count -eq 0) {
        $issues += "No base-related logs found - base system may not be working"
    }
    
    # Check for context menu issues
    $contextMenuLogs = $logData.logs | Where-Object { $_.message -match "context" -or $_.message -match "Context" }
    if ($contextMenuLogs.Count -eq 0) {
        $issues += "No context menu logs found - context menu may not be working"
    }
    
    return $issues
}

# Main testing loop
$iteration = 1
$maxIterations = 3

do {
    Write-Host "`nIteration $iteration of $maxIterations" -ForegroundColor Cyan
    Write-Host "=" * 50 -ForegroundColor Cyan
    
    # Get debug logs from API
    $logData = Get-DebugLogsFromAPI
    
    if ($logData) {
        # Save logs to file
        $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
        $logData | ConvertTo-Json -Depth 10 | Out-File -FilePath "debug-logs-$timestamp.json" -Encoding UTF8
        Write-Host "📄 Logs saved to debug-logs-$timestamp.json" -ForegroundColor Cyan
        
        # Test for errors
        $hasErrors = Test-ForErrors -logData $logData
        
        # Test for specific issues
        $specificIssues = Test-ForSpecificIssues -logData $logData
        
        if ($specificIssues.Count -gt 0) {
            Write-Host "`n⚠️ Specific issues found:" -ForegroundColor Yellow
            $specificIssues | ForEach-Object {
                Write-Host "  - $_" -ForegroundColor Yellow
            }
        }
        
        if ($hasErrors -or $specificIssues.Count -gt 0) {
            Write-Host "`n❌ Issues detected! Please fix the problems and run again." -ForegroundColor Red
            Write-Host "Press any key to continue after fixing..." -ForegroundColor Yellow
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        } else {
            Write-Host "`n✅ No issues found! Application appears to be working correctly." -ForegroundColor Green
            break
        }
    } else {
        Write-Host "`n❌ Could not retrieve debug logs. Please check if the server is running." -ForegroundColor Red
        Write-Host "Press any key to continue..." -ForegroundColor Yellow
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
    
    $iteration++
} while ($iteration -le $maxIterations)

if ($iteration -gt $maxIterations) {
    Write-Host "`nMaximum iterations reached. Some issues may still exist." -ForegroundColor Yellow
}

Write-Host "`nError testing complete!" -ForegroundColor Green