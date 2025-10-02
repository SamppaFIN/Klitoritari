# 🌸 QA MONITORING POWERSHELL COMMANDS
# 
# Comprehensive PowerShell commands for QA monitoring and server log access.
# Provides easy access to all QA endpoints and monitoring capabilities.
# 
# Sacred Purpose: Enables QA to easily monitor server logs, performance,
# and connection status for consciousness-aware testing and debugging.
# 
# @author Aurora AI Persona
# @version 1.0.0
# @since 2025-01-27

# Base server URL
$ServerUrl = "http://localhost:3000"

# 🌸 BASIC QA COMMANDS

# Get server status
function Get-ServerStatus {
    Write-Host "🌸 Fetching server status..." -ForegroundColor Magenta
    try {
        $response = Invoke-WebRequest -Uri "$ServerUrl/api/qa/status" -UseBasicParsing
        $data = $response.Content | ConvertFrom-Json
        Write-Host "✅ Server Status:" -ForegroundColor Green
        Write-Host "   Status: $($data.server.status)" -ForegroundColor White
        Write-Host "   Uptime: $($data.server.uptime)ms" -ForegroundColor White
        Write-Host "   Port: $($data.server.port)" -ForegroundColor White
        Write-Host "   PID: $($data.server.pid)" -ForegroundColor White
        Write-Host "   Platform: $($data.server.platform)" -ForegroundColor White
        Write-Host "   Node: $($data.server.nodeVersion)" -ForegroundColor White
        Write-Host "   WebSocket Connections: $($data.connections.websocket)" -ForegroundColor White
        Write-Host "   Players: $($data.connections.players)" -ForegroundColor White
        Write-Host "   Investigations: $($data.connections.investigations)" -ForegroundColor White
        return $data
    }
    catch {
        Write-Host "❌ Error fetching server status: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Get server performance metrics
function Get-ServerPerformance {
    Write-Host "🌸 Fetching server performance..." -ForegroundColor Magenta
    try {
        $response = Invoke-WebRequest -Uri "$ServerUrl/api/qa/performance" -UseBasicParsing
        $data = $response.Content | ConvertFrom-Json
        Write-Host "✅ Server Performance:" -ForegroundColor Green
        Write-Host "   Requests: $($data.performance.requestCount)" -ForegroundColor White
        Write-Host "   Memory Used: $([math]::Round($data.performance.memoryUsage.heapUsed / 1MB, 2)) MB" -ForegroundColor White
        Write-Host "   Memory Total: $([math]::Round($data.performance.memoryUsage.heapTotal / 1MB, 2)) MB" -ForegroundColor White
        Write-Host "   RSS: $([math]::Round($data.performance.memoryUsage.rss / 1MB, 2)) MB" -ForegroundColor White
        Write-Host "   External: $([math]::Round($data.performance.memoryUsage.external / 1MB, 2)) MB" -ForegroundColor White
        Write-Host "   Uptime: $($data.performance.uptime)ms" -ForegroundColor White
        return $data
    }
    catch {
        Write-Host "❌ Error fetching performance: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Get server logs
function Get-ServerLogs {
    param(
        [int]$Limit = 100,
        [string]$Type = "all"
    )
    Write-Host "🌸 Fetching server logs (limit: $Limit, type: $Type)..." -ForegroundColor Magenta
    try {
        $url = "$ServerUrl/api/qa/server-logs?limit=$Limit"
        if ($Type -ne "all") {
            $url += "&type=$Type"
        }
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing
        $data = $response.Content | ConvertFrom-Json
        Write-Host "✅ Server Logs ($($data.totalLogs) total):" -ForegroundColor Green
        foreach ($log in $data.logs) {
            $color = switch ($log.type) {
                "error" { "Red" }
                "warn" { "Yellow" }
                "request" { "Cyan" }
                "log" { "Green" }
                default { "White" }
            }
            $time = [DateTime]::Parse($log.timestamp).ToString("HH:mm:ss")
            Write-Host "   [$time] $($log.type.ToUpper()): $($log.message)" -ForegroundColor $color
        }
        return $data
    }
    catch {
        Write-Host "❌ Error fetching server logs: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Get server errors
function Get-ServerErrors {
    param([int]$Limit = 50)
    Write-Host "🌸 Fetching server errors (limit: $Limit)..." -ForegroundColor Magenta
    try {
        $response = Invoke-WebRequest -Uri "$ServerUrl/api/qa/errors?limit=$Limit" -UseBasicParsing
        $data = $response.Content | ConvertFrom-Json
        Write-Host "✅ Server Errors ($($data.totalErrors) total):" -ForegroundColor Green
        foreach ($error in $data.errors) {
            $time = [DateTime]::Parse($error.timestamp).ToString("HH:mm:ss")
            Write-Host "   [$time] $($error.message)" -ForegroundColor Red
            if ($error.stack) {
                Write-Host "      Stack: $($error.stack.Split("`n")[1])" -ForegroundColor DarkRed
            }
        }
        return $data
    }
    catch {
        Write-Host "❌ Error fetching server errors: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Get comprehensive QA report
function Get-QAReport {
    Write-Host "🌸 Fetching comprehensive QA report..." -ForegroundColor Magenta
    try {
        $response = Invoke-WebRequest -Uri "$ServerUrl/api/qa/report" -UseBasicParsing
        $data = $response.Content | ConvertFrom-Json
        Write-Host "✅ QA Report Generated:" -ForegroundColor Green
        Write-Host "   Server Uptime: $($data.serverInfo.uptime)ms" -ForegroundColor White
        Write-Host "   Total Requests: $($data.performance.requestCount)" -ForegroundColor White
        Write-Host "   WebSocket Connections: $($data.connections.websocket)" -ForegroundColor White
        Write-Host "   Players: $($data.connections.players)" -ForegroundColor White
        Write-Host "   Server Logs: $($data.logs.serverLogs.Count)" -ForegroundColor White
        Write-Host "   Server Errors: $($data.logs.errorLogs.Count)" -ForegroundColor White
        Write-Host "   Debug Logs Available: $($data.logs.debugLogs.available)" -ForegroundColor White
        Write-Host "   Game State Markers: $($data.gameState.markers)" -ForegroundColor White
        Write-Host "   Game State Quests: $($data.gameState.quests)" -ForegroundColor White
        return $data
    }
    catch {
        Write-Host "❌ Error fetching QA report: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Clear server logs
function Clear-ServerLogs {
    Write-Host "🌸 Clearing server logs..." -ForegroundColor Magenta
    try {
        $response = Invoke-WebRequest -Uri "$ServerUrl/api/qa/clear-logs" -Method POST -UseBasicParsing
        $data = $response.Content | ConvertFrom-Json
        Write-Host "✅ $($data.message)" -ForegroundColor Green
        return $data
    }
    catch {
        Write-Host "❌ Error clearing server logs: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# 🌸 ADVANCED QA COMMANDS

# Monitor server in real-time
function Start-ServerMonitoring {
    param([int]$IntervalSeconds = 5)
    Write-Host "🌸 Starting real-time server monitoring (interval: $IntervalSeconds seconds)..." -ForegroundColor Magenta
    Write-Host "Press Ctrl+C to stop monitoring" -ForegroundColor Yellow
    
    while ($true) {
        Clear-Host
        Write-Host "🌸 Real-Time Server Monitoring - $(Get-Date)" -ForegroundColor Magenta
        Write-Host "=" * 50 -ForegroundColor Gray
        
        # Get status
        $status = Get-ServerStatus
        if ($status) {
            Write-Host ""
            Write-Host "📊 Performance:" -ForegroundColor Cyan
            $perf = Get-ServerPerformance
            if ($perf) {
                Write-Host ""
                Write-Host "📝 Recent Logs:" -ForegroundColor Cyan
                Get-ServerLogs -Limit 10
                Write-Host ""
                Write-Host "❌ Recent Errors:" -ForegroundColor Cyan
                Get-ServerErrors -Limit 5
            }
        }
        
        Write-Host ""
        Write-Host "Next update in $IntervalSeconds seconds..." -ForegroundColor Yellow
        Start-Sleep -Seconds $IntervalSeconds
    }
}

# Export QA data to file
function Export-QAData {
    param([string]$FilePath = "qa-report-$(Get-Date -Format 'yyyy-MM-dd-HH-mm-ss').json")
    Write-Host "🌸 Exporting QA data to $FilePath..." -ForegroundColor Magenta
    try {
        $report = Get-QAReport
        if ($report) {
            $report | ConvertTo-Json -Depth 10 | Out-File -FilePath $FilePath -Encoding UTF8
            Write-Host "✅ QA data exported to $FilePath" -ForegroundColor Green
            return $FilePath
        }
    }
    catch {
        Write-Host "❌ Error exporting QA data: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Test all QA endpoints
function Test-QAEndpoints {
    Write-Host "🌸 Testing all QA endpoints..." -ForegroundColor Magenta
    
    $endpoints = @(
        @{ Name = "Server Status"; Url = "/api/qa/status" },
        @{ Name = "Performance"; Url = "/api/qa/performance" },
        @{ Name = "Server Logs"; Url = "/api/qa/server-logs?limit=10" },
        @{ Name = "Server Errors"; Url = "/api/qa/errors?limit=10" },
        @{ Name = "QA Report"; Url = "/api/qa/report" },
        @{ Name = "Debug Logs"; Url = "/api/debug-logs" }
    )
    
    foreach ($endpoint in $endpoints) {
        try {
            $response = Invoke-WebRequest -Uri "$ServerUrl$($endpoint.Url)" -UseBasicParsing
            Write-Host "✅ $($endpoint.Name): OK (Status: $($response.StatusCode))" -ForegroundColor Green
        }
        catch {
            Write-Host "❌ $($endpoint.Name): FAILED - $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

# Get server health summary
function Get-ServerHealth {
    Write-Host "🌸 Checking server health..." -ForegroundColor Magenta
    
    $health = @{
        Status = "Unknown"
        Issues = @()
        Warnings = @()
        Metrics = @{}
    }
    
    try {
        $status = Get-ServerStatus
        $perf = Get-ServerPerformance
        
        if ($status -and $perf) {
            $health.Status = "Healthy"
            $health.Metrics = @{
                Uptime = $status.server.uptime
                Requests = $perf.performance.requestCount
                MemoryUsage = $perf.performance.memoryUsage.heapUsed
                MemoryTotal = $perf.performance.memoryUsage.heapTotal
                WebSocketConnections = $status.connections.websocket
                Players = $status.connections.players
            }
            
            # Check for issues
            if ($perf.performance.memoryUsage.heapUsed / $perf.performance.memoryUsage.heapTotal -gt 0.9) {
                $health.Warnings += "High memory usage (>90%)"
            }
            
            if ($status.connections.websocket -gt 100) {
                $health.Warnings += "High WebSocket connection count (>100)"
            }
            
            # Check for errors
            $errors = Get-ServerErrors -Limit 10
            if ($errors -and $errors.totalErrors -gt 0) {
                $health.Issues += "$($errors.totalErrors) server errors found"
            }
        }
        else {
            $health.Status = "Unhealthy"
            $health.Issues += "Unable to fetch server status or performance data"
        }
    }
    catch {
        $health.Status = "Error"
        $health.Issues += "Error checking server health: $($_.Exception.Message)"
    }
    
    # Display health summary
    Write-Host "🏥 Server Health Summary:" -ForegroundColor Cyan
    Write-Host "   Status: $($health.Status)" -ForegroundColor $(if ($health.Status -eq "Healthy") { "Green" } else { "Red" })
    
    if ($health.Issues.Count -gt 0) {
        Write-Host "   Issues:" -ForegroundColor Red
        foreach ($issue in $health.Issues) {
            Write-Host "     - $issue" -ForegroundColor Red
        }
    }
    
    if ($health.Warnings.Count -gt 0) {
        Write-Host "   Warnings:" -ForegroundColor Yellow
        foreach ($warning in $health.Warnings) {
            Write-Host "     - $warning" -ForegroundColor Yellow
        }
    }
    
    if ($health.Metrics.Count -gt 0) {
        Write-Host "   Metrics:" -ForegroundColor White
        foreach ($metric in $health.Metrics.GetEnumerator()) {
            Write-Host "     $($metric.Key): $($metric.Value)" -ForegroundColor White
        }
    }
    
    return $health
}

# 🌸 QUICK QA COMMANDS

# Quick status check
function qa-status { Get-ServerStatus }
function qa-perf { Get-ServerPerformance }
function qa-logs { Get-ServerLogs }
function qa-errors { Get-ServerErrors }
function qa-report { Get-QAReport }
function qa-clear { Clear-ServerLogs }
function qa-monitor { Start-ServerMonitoring }
function qa-export { Export-QAData }
function qa-test { Test-QAEndpoints }
function qa-health { Get-ServerHealth }

# Display help
function Show-QAHelp {
    Write-Host "🌸 QA MONITORING COMMANDS" -ForegroundColor Magenta
    Write-Host "=" * 40 -ForegroundColor Gray
    Write-Host ""
    Write-Host "📊 Basic Commands:" -ForegroundColor Cyan
    Write-Host "  qa-status     - Get server status" -ForegroundColor White
    Write-Host "  qa-perf       - Get performance metrics" -ForegroundColor White
    Write-Host "  qa-logs       - Get server logs" -ForegroundColor White
    Write-Host "  qa-errors     - Get server errors" -ForegroundColor White
    Write-Host "  qa-report     - Get comprehensive QA report" -ForegroundColor White
    Write-Host "  qa-clear      - Clear server logs" -ForegroundColor White
    Write-Host ""
    Write-Host "🔄 Advanced Commands:" -ForegroundColor Cyan
    Write-Host "  qa-monitor    - Start real-time monitoring" -ForegroundColor White
    Write-Host "  qa-export     - Export QA data to file" -ForegroundColor White
    Write-Host "  qa-test       - Test all QA endpoints" -ForegroundColor White
    Write-Host "  qa-health     - Get server health summary" -ForegroundColor White
    Write-Host ""
    Write-Host "📖 Full Commands:" -ForegroundColor Cyan
    Write-Host "  Get-ServerStatus" -ForegroundColor White
    Write-Host "  Get-ServerPerformance" -ForegroundColor White
    Write-Host "  Get-ServerLogs [-Limit 100] [-Type 'error']" -ForegroundColor White
    Write-Host "  Get-ServerErrors [-Limit 50]" -ForegroundColor White
    Write-Host "  Get-QAReport" -ForegroundColor White
    Write-Host "  Clear-ServerLogs" -ForegroundColor White
    Write-Host "  Start-ServerMonitoring [-IntervalSeconds 5]" -ForegroundColor White
    Write-Host "  Export-QAData [-FilePath 'filename.json']" -ForegroundColor White
    Write-Host "  Test-QAEndpoints" -ForegroundColor White
    Write-Host "  Get-ServerHealth" -ForegroundColor White
    Write-Host ""
    Write-Host "🌸 Server URL: $ServerUrl" -ForegroundColor Magenta
    Write-Host "🌸 Press Ctrl+Shift+Q in browser to open QA Dashboard" -ForegroundColor Magenta
}

# Initialize QA commands
Write-Host "🌸 QA Monitoring Commands Loaded!" -ForegroundColor Magenta
Write-Host "Type 'Show-QAHelp' for available commands" -ForegroundColor Yellow
Write-Host "Type 'qa-status' for quick server status check" -ForegroundColor Yellow
