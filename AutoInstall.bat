@echo off
REM AI Trading 2.0 - Auto Installer Launcher
REM Questo batch avvia l'installer PowerShell con interfaccia grafica

title AI Trading 2.0 - Auto Installer

echo ===================================================
echo   🚀 AI TRADING 2.0 - MT5 AUTO INSTALLER
echo ===================================================
echo.

REM Verifica se stiamo eseguendo come amministratore
net session >nul 2>&1
if %errorLevel% == 0 (
    goto :ADMIN_CHECK_PASSED
) else (
    echo ❌ Devi eseguire questo script come Amministratore!
    echo 🙏 Clicca destro su questo file e seleziona "Esegui come amministratore"
    echo.
    pause
    exit /b 1
)

:ADMIN_CHECK_PASSED
echo ✓ Permessi di amministratore verificati
echo.

REM Chiedi le credenziali MT5
echo Inserisci le tue credenziali MetaTrader 5:
echo =======================================
echo.
set /p MT5_LOGIN="Login MT5 (esempio: 67163307): "

REM Nasconde la password durante l'input
echo Immetti la password MT5:
powershell -Command "$pwd = Read-Host -AsSecureString; $plain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($pwd)); Write-Host $plain" > temp_password.txt
set /p MT5_PASSWORD=<temp_password.txt
del temp_password.txt

echo.
echo Credenziali ricevute (login: %MT5_LOGIN%)
echo.

REM Conferma prima di procedere
echo ===================================================
echo   ⚠️ CONFERMA INSTALLAZIONE
echo ===================================================
echo Verrano installati automaticamente:
echo  - MetaTrader 5 (se non già installato)
echo  - Python 3.9.7
echo  - Dipendenze Python necessarie
echo  - MT5 Bridge Server
echo  - Servizio Windows per auto-avvio
echo.
echo 💾Questo potrebbe richiedere 10-15 minuti
echo.
set /p CONFIRM="Sei sicuro di voler procedere? (s/n): "

if /i not "%CONFIRM%"=="s" (
    echo Installazione annullata dall'utente
    pause
    exit /b 0
)

echo.
echo 🚀 Avvio installazione...
echo.

powershell.exe -ExecutionPolicy Bypass -File "%~dp0MT5_Auto_Installer.ps1" -MT5Login "%MT5_LOGIN%" -MT5Password "%MT5_PASSWORD%"

echo.
echo ===================================================
echo   ✅ PROCESSO COMPLETATO
echo ===================================================
echo.
echo Se l'installazione è riuscita, il sistema è ora configurato.
echo.
echo 🔄 RICORDATI DI RIAVVIARE IL COMPUTER per attivare il servizio MT5!
echo.
pause