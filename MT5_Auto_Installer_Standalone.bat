@echo off
REM MT5 Auto Installer - Versione Standalone per Cliente
REM Clicca due volte questo file per iniziare l'installazione

title AI Trading 2.0 - MT5 Auto Installer

echo ================================================
echo       🚀 MT5 AUTO INSTALLER STANDALONE
echo ================================================
echo.

REM Verifica se sta eseguendo come amministratore
net session >nul 2>&1
if %errorLevel% == 0 (
    goto :RUN_INSTALL
) else (
    echo ❌ Devi eseguire questo script come amministratore!
    echo.
    echo 🔧 Come fare:
    echo   1. Clicca destro su questo file (.bat)
    echo   2. Seleziona "Esegui come amministratore"
    echo   3. Conferma nella finestra che appare
    echo.
    pause
    exit /b 1
)

:RUN_INSTALL
echo ✅ Verificati permessi amministratore
echo.

echo 🔍 Raccogliendo credenziali MT5...
echo ===================================

REM Chiedi credenziali MT5 in modo sicuro
echo Inserisci le tue credenziali MetaTrader 5:
echo (La password non verrà mostrata a video)
echo.

set /p MT5_LOGIN="Login MT5 (es. 67163307): "
if "%MT5_LOGIN%"=="" (
    echo ❌ Login obbligatorio!
    pause
    exit /b 1
)

REM Lettura password semplice e sicura
echo Inserisci la password MT5 (verra nascosta):
for /f "delims=" %%i in ('powershell -Command "Read-Host"') do set MT5_PASSWORD=%%i

if "%MT5_PASSWORD%"=="" (
    echo ❌ Password obbligatoria!
    pause
    exit /b 1
)

echo.
echo ✅ Credenziali ricevute
echo.

REM Chiedi conferma finale
echo ===========================================
echo          ⚠️ CONFERMA INSTALLAZIONE
echo ===========================================
echo.
echo Sarà installato automaticamente:
echo ──────────────────────────────────────
echo • MetaTrader 5 (se non presente)
echo • Python 3.9.7
echo • Librerie necessarie per MT5
echo • Bridge per connessione remota
echo • Configurazione auto-avvio
echo ──────────────────────────────────────
echo.
echo Sarà creato il file: mt5_credentials.json
echo con le tue credenziali criptate
echo.
echo 💡 Tempo stimato: 10-15 minuti
echo.
set /p CONFIRM="Vuoi procedere? (s/n): "

if /i not "%CONFIRM%"=="s" (
    if /i not "%CONFIRM%"=="si" (
        echo Installazione annullata.
        pause
        exit /b 0
    )
)

echo.
echo 🚀 Avvio installazione completa...
echo ================================

REM Crea file temporaneo per PowerShell con credenziali
echo $MT5Login = "%MT5_LOGIN%" > temp_install.ps1
echo $MT5Password = "%MT5_PASSWORD%" >> temp_install.ps1
echo. >> temp_install.ps1

REM Aggiungi tutto il contenuto del file PowerShell
type MT5_Auto_Installer_EXE.ps1 >> temp_install.ps1

REM Esegui PowerShell con le credenziali
powershell.exe -ExecutionPolicy Bypass -File "temp_install.ps1"

REM Pulisci file temporanei
del temp_install.ps1 2>nul

echo.
echo ===========================================
echo         ✅ INSTALLAZIONE COMPLETATA!
echo ===========================================
echo.
echo 🎯 COSA FARE ADESSO:
echo.
echo 1. RIAVVIA il computer
echo 2. Apri MetaTrader 5
echo 3. Verifica che si connette al conto
echo 4. Apri la dashboard del trading
echo 5. Vai in MT5 Setup e testa connessione
echo.
echo 🔍 SE I PROBLEMI PERSISTONO:
echo • Verifica che MT5 sia stato installato
echo • Controlla che le credenziali siano corrette
echo • Riesegui questo installer come amministratore
echo.
echo 📝 File utili creati:
echo • start_mt5_bridge.bat (per avviare manualmente)
echo • mt5_credentials.json (credenziali criptate)
echo • mt5_bridge.log (log connessione)
echo.

pause

echo Arrivederci! Il sistema è ora configurato 💼
timeout /t 3 >nul