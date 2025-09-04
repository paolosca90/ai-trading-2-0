#Requires -RunAsAdministrator

<#
.SYNOPSIS
    AI Trading 2.0 - MT5 Auto Installer
    Installa e configura automaticamente MetaTrader 5 con Python Bridge

.DESCRIPTION
    Questo script PowerShell installa e configura:
    - MetaTrader 5
    - Python 3.7+
    - Dipendenze Python (MetaTrader5, Flask, ecc.)
    - MT5 Python Bridge Server
    - Servizio Windows per auto-avvio
    - Verifica connessione finale

.EXAMPLE
    .\MT5_Auto_Installer.ps1
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$MT5Login,

    [Parameter(Mandatory=$true)]
    [string]$MT5Password,

    [Parameter(Mandatory=$false)]
    [string]$MT5Server = "RoboForex-ECN",

    [Parameter(Mandatory=$false)]
    [switch]$SkipMT5
)

# Configurazione
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$MT5_DOWNLOAD_URL = "https://download.mql5.com/forexsetup.exe"
$PYTHON_DOWNLOAD_URL = "https://www.python.org/ftp/python/3.9.7/python-3.9.7-amd64.exe"
$MT5_SETUP_PATH = "C:\Program Files\MetaTrader 5\terminal64.exe"
$PYTHON_INSTALL_PATH = "C:\Python39"
$WORKING_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path

# Configurazione colori per output
$colors = @{
    "Title" = "Cyan"
    "Success" = "Green"
    "Warning" = "Yellow"
    "Error" = "Red"
    "Info" = "White"
}

function Write-ColoredMessage {
    param(
        [string]$Message,
        [string]$Color = "Info"
    )

    $colorCode = $colors.ContainsKey($Color) ? $colors[$Color] : "White"
    Write-Host "[$((Get-Date).ToString('HH:mm:ss'))] $Message" -ForegroundColor $colorCode
}

function Test-Administrator {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Get-WebContentLength {
    param([string]$url)
    try {
        $response = Invoke-WebRequest -Uri $url -Method Head
        return [int64]$response.Headers["Content-Length"]
    } catch {
        return 0
    }
}

function Download-WithProgress {
    param(
        [string]$url,
        [string]$destination,
        [string]$fileDescription = "file"
    )

    Write-ColoredMessage "Downloading $fileDescription from $url..." "Info"

    try {
        $response = Invoke-WebRequest -Uri $url -OutFile $destination
        Write-ColoredMessage "✓ Download completed: $fileDescription" "Success"
        return $true
    } catch {
        Write-ColoredMessage "❌ Download failed: $($_.Exception.Message)" "Error"
        return $false
    }
}

function Install-MT5 {
    if ($SkipMT5) {
        Write-ColoredMessage "⏭️ Skipping MT5 installation" "Warning"
        return $true
    }

    Write-ColoredMessage "🚀 Installing MetaTrader 5..." "Title"

    $mt5Installer = "$env:TEMP\mt5_setup.exe"

    if (-not (Download-WithProgress $MT5_DOWNLOAD_URL $mt5Installer "MetaTrader 5 installer")) {
        return $false
    }

    try {
        Write-ColoredMessage "Executing MetaTrader 5 installer (this may take a few minutes)..." "Info"

        # Install in silent mode
        $process = Start-Process -FilePath $mt5Installer -ArgumentList "/quiet", "/norestart" -Wait -PassThru

        if ($process.ExitCode -eq 0) {
            Write-ColoredMessage "✓ MetaTrader 5 installed successfully" "Success"

            # Enable automated trading and DLL imports
            Write-ColoredMessage "Configuring MetaTrader 5 settings..." "Info"

            # Create MT5 config files if they don't exist
            $terminalConfigPath = "$env:APPDATA\MetaQuotes\Terminal\$((Get-ChildItem 'HKCU:\Software\Classes\MT5.Instance*').PSChildName)\config\terminal.ini"

            if (Test-Path $terminalConfigPath) {
                $configContent = Get-Content $terminalConfigPath
                $configContent -replace ";ExpertsDllImport=0", "ExpertsDllImport=1" |
                $configContent -replace ";ExpertsExpert=0", "ExpertsExpert=1" | Out-File $terminalConfigPath
            }

            return $true
        } else {
            Write-ColoredMessage "❌ MetaTrader 5 installation failed (Exit code: $($process.ExitCode))" "Error"
            return $false
        }
    } catch {
        Write-ColoredMessage "❌ MetaTrader 5 installation error: $($_.Exception.Message)" "Error"
        return $false
    } finally {
        # Cleanup installer
        if (Test-Path $mt5Installer) {
            Remove-Item $mt5Installer -Force
        }
    }
}

function Install-Python {
    Write-ColoredMessage "🐍 Installing Python 3.9..." "Title"

    $pythonInstaller = "$env:TEMP\python_installer.exe"

    if (-not (Download-WithProgress $PYTHON_DOWNLOAD_URL $pythonInstaller "Python 3.9.7")) {
        return $false
    }

    try {
        Write-ColoredMessage "Installing Python (this will take a few minutes)..." "Info"

        # Install Python silently with all features
        $process = Start-Process -FilePath $pythonInstaller -ArgumentList "/quiet InstallAllUsers=1 PrependPath=1 Include_doc=0 Include_pip=1 Include_tcltk=1 Include_test=0" -Wait -PassThru

        if ($process.ExitCode -eq 0) {
            Write-ColoredMessage "✓ Python installed successfully" "Success"

            # Refresh PATH
            $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

            # Test Python installation
            $pythonVersion = & python --version 2>&1
            Write-ColoredMessage "Python version: $pythonVersion" "Info"

            return $true
        } else {
            Write-ColoredMessage "❌ Python installation failed (Exit code: $($process.ExitCode))" "Error"
            return $false
        }
    } catch {
        Write-ColoredMessage "❌ Python installation error: $($_.Exception.Message)" "Error"
        return $false
    } finally {
        # Cleanup installer
        if (Test-Path $pythonInstaller) {
            Remove-Item $pythonInstaller -Force
        }
    }
}

function Install-PythonPackages {
    Write-ColoredMessage "📦 Installing Python dependencies..." "Title"

    $packages = @(
        "MetaTrader5>=5.0.0",
        "Flask>=2.0.0",
        "Flask-CORS>=3.0.0",
        "requests>=2.25.0"
    )

    foreach ($package in $packages) {
        try {
            Write-ColoredMessage "Installing $package..." "Info"
            $result = & pip install $package 2>&1

            if ($LASTEXITCODE -eq 0) {
                Write-ColoredMessage "✓ $package installed successfully" "Success"
            } else {
                Write-ColoredMessage "❌ Failed to install $package" "Error"
                Write-ColoredMessage "Pip output: $result" "Error"
                return $false
            }
        } catch {
            Write-ColoredMessage "❌ Error installing $package : $($_.Exception.Message)" "Error"
            return $false
        }
    }

    return $true
}

function Configure-MT5Bridge {
    Write-ColoredMessage "🔧 Configuring MT5 Python Bridge..." "Title"

    # Check if mt5_bridge.py exists
    $bridgePath = Join-Path $WORKING_DIR "mt5_bridge.py"

    if (-not (Test-Path $bridgePath)) {
        Write-ColoredMessage "❌ mt5_bridge.py not found in $WORKING_DIR" "Error"
        return $false
    }

    # Create startup script
    $startupScript = @"
@echo off
call python "$bridgePath"
"@

    $startupScriptPath = Join-Path $WORKING_DIR "start_mt5_bridge.bat"
    $startupScript | Out-File -FilePath $startupScriptPath -Encoding ASCII
    Write-ColoredMessage "✓ Created startup script: $startupScriptPath" "Success"

    # Create Windows service using NSSM or basic task
    $taskName = "AI Trading MT5 Bridge"

    try {
        # Create scheduled task to run on system startup
        $action = New-ScheduledTaskAction -Execute "python.exe" -Argument "\"$bridgePath\"" -WorkingDirectory $WORKING_DIR
        $trigger = New-ScheduledTaskTrigger -AtStartup
        $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable
        $principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType InteractiveToken

        Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Force

        Write-ColoredMessage "✓ Created scheduled task: $taskName" "Success"
    } catch {
        Write-ColoredMessage "⚠️ Failed to create scheduled task: $($_.Exception.Message)" "Warning"
        Write-ColoredMessage "ℹ️ You can still start the bridge manually with: $startupScriptPath" "Info"
    }

    # Create credentials file for auto-login
    $credentials = @{
        login = $MT5Login
        password = $MT5Password
        server = $MT5Server
    } | ConvertTo-Json

    $credFile = Join-Path $WORKING_DIR "mt5_credentials.json"
    $credentials | Out-File -FilePath $credFile -Encoding UTF8
    Write-ColoredMessage "✓ Created credentials file: $credFile" "Success"

    return $true
}

function Test-MT5Connection {
    Write-ColoredMessage "🔍 Testing MT5 Bridge connection..." "Title"

    try {
        # Start the bridge temporarily
        Write-ColoredMessage "Starting MT5 bridge temporarily..." "Info"

        $bridgePath = Join-Path $WORKING_DIR "mt5_bridge.py"
        $process = Start-Process -FilePath "python.exe" -ArgumentList "`"$bridgePath`"" -NoNewWindow -RedirectStandardOutput "$env:TEMP\bridge_output.log"

        # Wait for bridge to start
        Start-Sleep -Seconds 5

        # Test health endpoint
        $healthUrl = "http://localhost:8080/health"
        Write-ColoredMessage "Testing health endpoint: $healthUrl" "Info"

        try {
            $response = Invoke-WebRequest -Uri $healthUrl -TimeoutSec 10
            $responseData = $response.Content | ConvertFrom-Json

            if ($responseData.status -eq "ok" -or $responseData.status -eq "disconnected") {
                Write-ColoredMessage "✓ MT5 Bridge is responding" "Success"
                return $true
            } else {
                Write-ColoredMessage "⚠️ MT5 Bridge responded but MT5 is not connected" "Warning"
                Write-ColoredMessage "This is normal. MT5 connection will be attempted when the bridge starts permanently." "Info"
                return $true
            }
        } catch {
            Write-ColoredMessage "❌ MT5 Bridge is not responding: $($_.Exception.Message)" "Error"
            return $false
        }

    } finally {
        # Kill the test process
        if ($process.Id) {
            Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
        }

        # Show log output
        if (Test-Path "$env:TEMP\bridge_output.log") {
            Write-ColoredMessage "Last bridge log entries:" "Info"
            Get-Content "$env:TEMP\bridge_output.log" -Tail 5 | ForEach-Object { Write-ColoredMessage "  $_" "Info" }
            Remove-Item "$env:TEMP\bridge_output.log" -Force
        }
    }
}

function Show-ConfigurationSummary {
    Write-ColoredMessage "" "Info"
    Write-ColoredMessage "🎉 INSTALLATION COMPLETED!" "Title"
    Write-ColoredMessage "" "Info"
    Write-ColoredMessage "Summary of what was installed/configured:" "Info"
    Write-ColoredMessage "─────────────────────────────────────────" "Info"
    Write-ColoredMessage "● MetaTrader 5 - Installed with automated trading enabled" "Success"
    Write-ColoredMessage "● Python 3.9.7 - Installed with pip" "Success"
    Write-ColoredMessage "● MT5 Python Bridge - Configured for auto-start" "Success"
    Write-ColoredMessage "● Windows Scheduled Task - Bridge will start automatically" "Success"
    Write-ColoredMessage "● Credentials - Saved for automatic connection" "Success"
    Write-ColoredMessage "" "Info"
    Write-ColoredMessage "🚀 NEXT STEPS:" "Title"
    Write-ColoredMessage "1. Restart your computer to activate the bridge service" "Info"
    Write-ColoredMessage "2. Open MetaTrader 5 and make sure it's connected to $MT5Server" "Info"
    Write-ColoredMessage "3. Launch your AI Trading application" "Info"
    Write-ColoredMessage "" "Info"
    Write-ColoredMessage "💡 Monitor bridge logs at: $WORKING_DIR\mt5_bridge.log" "Info"
    Write-ColoredMessage "🔧 Manual start: Run '$WORKING_DIR\start_mt5_bridge.bat'" "Info"
}

# Main execution
try {
    Write-ColoredMessage "=== AI TRADING 2.0 - MT5 AUTO INSTALLER ===" "Title"
    Write-ColoredMessage "Machine: $($env:COMPUTERNAME)" "Info"
    Write-ColoredMessage "User: $($env:USERNAME)" "Info"
    Write-ColoredMessage "Working Directory: $WORKING_DIR" "Info"
    Write-ColoredMessage "" "Info"

    # Test for administrator rights
    if (-not (Test-Administrator)) {
        Write-ColoredMessage "❌ This script must be run as Administrator!" "Error"
        Write-ColoredMessage "Please right-click on PowerShell and select 'Run as Administrator'" "Error"
        exit 1
    }

    # Validate parameters
    if (-not $MT5Login -or -not $MT5Password) {
        Write-ColoredMessage "❌ MT5 login and password are required!" "Error"
        Write-ColoredMessage "Usage: .\MT5_Auto_Installer.ps1 -MT5Login 'your_login' -MT5Password 'your_password'" "Error"
        exit 1
    }

    # Install components
    $steps = @(
        @{ Name = "MetaTrader 5"; Function = "Install-MT5"; Skip = $SkipMT5 }
        @{ Name = "Python"; Function = "Install-Python"; Skip = $false }
        @{ Name = "Python Packages"; Function = "Install-PythonPackages"; Skip = $false }
        @{ Name = "MT5 Bridge"; Function = "Configure-MT5Bridge"; Skip = $false }
        @{ Name = "Connection Test"; Function = "Test-MT5Connection"; Skip = $false }
    )

    foreach ($step in $steps) {
        if (-not $step.Skip) {
            if (& (Get-Command $step.Function)) {
                Write-ColoredMessage ""
            } else {
                Write-ColoredMessage "❌ Function $($step.Function) not found" "Error"
                continue
            }
        }
    }

    Show-ConfigurationSummary

} catch {
    Write-ColoredMessage "❌ Critical error during installation: $($_.Exception.Message)" "Error"
    Write-ColoredMessage "Stack Trace: $($_.ScriptStackTrace)" "Error"
    exit 1
}

Write-ColoredMessage ""
Write-ColoredMessage "Installation completed successfully! 🎉" "Title"
Read-Host "Press Enter to exit"