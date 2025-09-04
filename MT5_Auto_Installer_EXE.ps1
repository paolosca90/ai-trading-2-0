#Requires -RunAsAdministrator

<#
.SYNOPSIS
    AI Trading 2.0 - MT5 Auto Installer Standalone EXE
    Super-semplificato per esecuzione diretta su Windows
    Versione alternativa senza dipendenze esterne
#>

param(
    [string]$MT5Login = "",
    [string]$MT5Password = "",
    [switch]$Force
)

function Write-Header {
    Write-Host ""
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host "  🚀 AI TRADING 2.0 INSTALLER" -ForegroundColor Cyan
    Write-Host "      Versione STAND ALONE" -ForegroundColor White
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host ""
}

function Write-Step {
    param($message, $color = "White")
    Write-Host "[$((Get-Date).ToString('HH:mm:ss'))]" -ForegroundColor Cyan -NoNewline
    Write-Host " $message" -ForegroundColor $color
}

function Install-Python-Manual {
    Write-Step "📥 Scaricando Python 3.9..." "Yellow"

    try {
        $pythonUrl = "https://www.python.org/ftp/python/3.9.7/python-3.9.7-amd64.exe"
        $pythonInstaller = "$env:TEMP\python39_installer.exe"

        Invoke-WebRequest -Uri $pythonUrl -OutFile $pythonInstaller -UseBasicParsing

        Write-Step "🐍 Installando Python..." "Yellow"
        $process = Start-Process $pythonInstaller -ArgumentList "/quiet InstallAllUsers=1 PrependPath=1 Include_pip=1" -Wait -PassThru

        if ($process.ExitCode -eq 0) {
            Write-Step "✅ Python installato correttamente" "Green"
            return $true
        } else {
            Write-Step "❌ Installazione Python fallita" "Red"
            return $false
        }
    } catch {
        Write-Step "❌ Errore download Python: $($_.Exception.Message)" "Red"
        return $false
    }
}

function Configure-Credentials {
    Write-Step "🔐 Configurando credenziali MT5..." "Yellow"

    if (-not $MT5Login -or -not $MT5Password) {
        Write-Step "🔑 Credenziali non fornite - richiesta manuale..." "Yellow"
        Write-Host ""

        $MT5Login = Read-Host "Inserisci il tuo MT5 Login (es: 67163307)"
        $MT5Password = Read-Host "Inserisci la tua MT5 Password" -AsSecureString
        $MT5Password = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($MT5Password))

        Write-Host ""
    }

    # Salva credenziali in file protetto
    $credFile = "mt5_credentials.json"
    $credData = @{
        login = $MT5Login
        password = $MT5Password
        server = "RoboForex-ECN"
    }

    $credData | ConvertTo-Json | Set-Content -Path $credFile -Encoding UTF8

    Write-Step "✅ Credenziali salvate in $credFile" "Green"
    return $true
}

function Main {
    Write-Header

    Write-Step "🔍 Controllo sistema..." "White"
    Write-Step "Sistema: $([Environment]::OSVersion.VersionString)" "Gray"
    Write-Step "Architettura: $([Environment]::Is64BitOperatingSystem ? '64-bit' : '32-bit')" "Gray"

    # Verifica privilegi amministratore
    $isAdmin = ([Security.Principal.WindowsIdentity]::GetCurrent()).Groups -contains 'S-1-5-32-544'
    if (-not $isAdmin) {
        Write-Step "❌ DEVI AVERE PRIVILEGI AMMINISTRATORE!" "Red"
        Write-Step "Clicca destro su questo file e seleziona 'Esegui come amministratore'" "Red"
        Read-Host "Premi ENTER per chiudere"
        exit 1
    }

    Write-Step "✅ Privilegi amministratore verificati" "Green"

    Write-Step "🚧 PASSO 1/4 - Verifica MetaTrader 5..." "White"
    $mt5Path = "C:\Program Files\MetaTrader 5\terminal64.exe"
    if (Test-Path $mt5Path) {
        Write-Step "✅ MT5 già installato" "Green"
    } else {
        Write-Step "⚠️  MT5 non trovato - richiede installazione manuale" "Yellow"
        Write-Step "   Scarica da: https://www.roboforex.com/trading-platforms/metatrader5/" "White"
        Write-Step "   Premi ENTER quando hai finito l'installazione MT5" "White"
        Read-Host
    }

    Write-Step "🚧 PASSO 2/4 - Installazione Python..." "White"
    $pythonInstalled = $false
    try {
        $pythonVersion = & python --version 2>$null
        if ($pythonVersion) {
            Write-Step "✅ Python già installato: $pythonVersion" "Green"
            $pythonInstalled = $true
        }
    } catch {}

    if (-not $pythonInstalled) {
        $installPython = Read-Host "Python non trovata. Volete installarla automaticamente? (s/n)"
        if ($installPython -eq 's' -or $installPython -eq 'S') {
            if (-not (Install-Python-Manual)) {
                Write-Step "   Installazione fallita - procedi manualmente" "Red"
            }
        }
    }

    Write-Step "🚧 PASSO 3/4 - Configurazione credenziali..." "White"
    if (-not (Configure-Credentials)) {
        Write-Step "❌ Configurazione credenziali fallita" "Red"
        exit 1
    }

    Write-Step "🚧 PASSO 4/4 - Installazione dipendenze Python..." "White"
    try {
        pip install MetaTrader5 Flask flask-cors requests --quiet
        Write-Step "✅ Dipendenze Python installate" "Green"
    } catch {
        Write-Step "⚠️ Installazione pip fallita - verifica connessione internet" "Yellow"
    }

    # Crea script di avvio
    Write-Step "📝 Creazione script di avvio..." "White"
    $startupScript = @"
@echo off
python "%~dp0mt5_bridge.py"
"@

    $startupScript | Out-File -FilePath "start_mt5_bridge.bat" -Encoding UTF8
    Write-Step "✅ Script di avvio creato: start_mt5_bridge.bat" "Green"

    Write-Host ""
    Write-Host "====================================" -ForegroundColor Green
    Write-Host "      ✅ INSTALLAZIONE COMPLETA!" -ForegroundColor Green
    Write-Host "====================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎯 COSA FARE ADESSO:" -ForegroundColor Yellow
    Write-Host "1. RIAVVIA il computer" -ForegroundColor White
    Write-Host "2. Apri MetaTrader 5 e accedi al tuo conto" -ForegroundColor White
    Write-Host "3. Doppio clic: start_mt5_bridge.bat" -ForegroundColor White
    Write-Host "4. Se funziona: clicca 'Inizia Trading'" -ForegroundColor White
    Write-Host ""
    Write-Host "🔍 TROUBLESHOOTING:" -ForegroundColor Yellow
    Write-Host "• MT5 non si connette? Controlla credenziali" -ForegroundColor White
    Write-Host "• Bridge non parte? Esegui come amministratore" -ForegroundColor White
    Write-Host "• Python errori? Installa Visual Studio Build Tools" -ForegroundColor White
    Write-Host ""

    Read-Host "Premi ENTER per completare"
}

# Esegui installazione
try {
    Main
} catch {
    Write-Step "❌ Errore critico: $($_.Exception.Message)" "Red"
    Write-Step "Stack Trace: $($_.ScriptStackTrace)" "Red"
    Read-Host "Premi ENTER per chiudere"
    exit 1
}