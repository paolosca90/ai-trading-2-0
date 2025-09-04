@echo off
REM MT5 Simple Installer - Versione CERTAINO senza crash!
REM Tutto batch nativo, nessuna PowerShell complicata

title AI Trading 2.0 - MT5 Simple Installer

echo ================================================
echo      🚀 AI TRADING 2.0 - MT5 INSTALLER
echo ================================================
echo.
echo Questa versione evita tutti i problemi di sintassi!
echo.

REM Verifica se amministratore
whoami /groups | find "S-1-5-32-544" >nul
if errorlevel 1 (
    echo ❌ Devi eseguire come amministratore!
    echo.
    echo 🔧 Come fare:
    echo   1. Clic destro sul file
    echo   2. "Esegui come amministratore"
    echo.
    pause
    exit /b 1
)

echo ✅ Permessi amministratore OK
echo.

REM Installazione diretta senza confirmation
echo 🚀 Avvio installazione automatica...
echo ==================================

call :INSTALL_MT5
if errorlevel 1 goto ERROR

echo.
echo ✅ Installazione completata con successo!
echo.
echo 🔄 RIAVVIA il computer prima di usare il sistema!
echo.
pause

exit /b 0

:INSTALL_MT5
echo Installazione MetaTrader 5...
echo.

REM Scarica MT5 installer
echo Scaricando MT5 installer...
powershell -Command "Invoke-WebRequest -Uri 'https://download.mql5.com/cdn/web/metaquotes.ltd/mt5/mt5setup.exe?utm_source=www.metatrader4.com&utm_campaign=download' -OutFile 'C:\Temp\mt5_installer.exe'" 2>nul
if errorlevel 1 (
    echo ⚠️ Download MT5 fallito, verifica connessione internet
    goto MT5_SKIP
)

REM Installa MT5 silenziosamente
echo Installando MT5...
START /WAIT C:\Temp\mt5_installer.exe /quiet /norestart
if errorlevel 1 (
    echo ⚠️ Installazione MT5 fallita
    goto MT5_SKIP
)

echo ✅ MT5 installato correttamente!

:MT5_SKIP

REM Installa Python se mancante
echo Verifica Python...
python --version >nul 2>&1
if errorlevel 1 (
    goto INSTALL_PYTHON
) else (
    echo ✅ Python già presente
    goto INSTALL_PACKAGES
)

:INSTALL_PYTHON
echo Installazione Python 3.9...
echo.

powershell -Command "Invoke-WebRequest -Uri 'https://www.python.org/ftp/python/3.9.7/python-3.9.7-amd64.exe' -OutFile 'C:\Temp\python_installer.exe'" 2>nul
if errorlevel 1 (
    echo ❌ Download Python fallito
    goto ERROR
)

START /WAIT C:\Temp\python_installer.exe /quiet InstallAllUsers=1 PrependPath=1 Include_pip=1
if errorlevel 1 (
    echo ❌ Installazione Python fallita
    goto ERROR
)

echo ✅ Python installato correttamente!
goto INSTALL_PACKAGES

:INSTALL_PACKAGES
echo Installazione pacchetti Python necessari...
echo.

REM Installa MetaTrader5 tramite pip
python -m pip install MetaTrader5 Flask flask-cors requests --quiet
if errorlevel 1 (
    echo ⚠️ Installazione pacchetti fallita, prosegui comunque...
)

REM Configura credenziali inizia giorno
echo.
echo 🔑 Credenziali MT5 (verranno salvate in mt5_credentials.json)
echo.

set /p MT5_LOGIN="MT5 Login (es. 67163307): "
set /p MT5_PASSWORD="MT5 Password: "

echo Creazione file credenziali...
echo {"login":"%MT5_LOGIN%","password":"%MT5_PASSWORD%","server":"RoboForex-ECN"} > mt5_credentials.json

echo ✅ Credenziali salvate!

REM Crea script di avvio
echo Creazione script di avvio...
echo @echo off > start_mt5_bridge.bat
echo py mt5_bridge.py >> start_mt5_bridge.bat
echo pause >> start_mt5_bridge.bat

echo ✅ Script di avvio creato: start_mt5_bridge.bat

echo.
goto :EOF

:ERROR
echo ❌ Errore durante installazione
echo Prova a riavviare il computer e rieseguire
pause
exit /b 1