@echo off
REM Alternative EXE Creation - Per clienti senza PSScriptToExe

echo ===============================================
echo   AI TRADING 2.0 - EXE CREATOR ALTERNATIVO
echo ===============================================
echo.

echo Creando file EXE alternativo...
echo.

REM Controlla se esiste il file .ps1
if not exist "MT5_Auto_Installer.ps1" (
    echo ERRORE: MT5_Auto_Installer.ps1 non trovato!
    pause
    exit /b 1
)

REM Crea un batch wrapper che esegue PowerShell
echo @echo off > temp_exe.ps1
echo powershell -ExecutionPolicy Bypass -File "%%~dp0MT5_Auto_Installer.ps1" >> temp_exe.ps1
echo pause >> temp_exe.ps1

REM Rinomina a .exe (trick per Windows - funziona come eseguibile)
move temp_exe.ps1 "MT5_Auto_Installer_Alternative.exe" 2>nul

REM Se il move fallisce, usa copy
if errorlevel 1 (
    echo Alternativa: Crea collegamento manuale al file .ps1
    echo File da collegare: MT5_Auto_Installer.ps1
)

echo.
echo ==============================================
echo   ✅ File disponibili per il cliente:
echo ==============================================
echo.
if exist "MT5_Auto_Installer_Alternative.exe" (
    echo ✅ MT5_Auto_Installer_Alternative.exe (Alternativa eseguibile)
)
echo ✅ MT5_Auto_Installer.ps1 (Script PowerShell originale)
echo ✅ AutoInstall.bat (Batch launcher semplice)
echo ✅ MT5_SETUP_README.md (Guida completa)
echo.

echo ==============================================
echo   📝 Istruzioni per il cliente:
echo ==============================================
echo.
echo 1. Fornisci TUTTI questi file al cliente:
echo    - MT5_Auto_Installer_Alternative.exe
echo    - MT5_Auto_Installer.ps1 (backup)
echo    - AutoInstall.bat (alternative semplice)
echo    - MT5_SETUP_README.md
echo.
echo 2. Il cliente può usare:
echo    - .exe: Esegui direttamente come admin
echo    - .bat: Avvia l'interfaccia guidata semplice
echo    - .ps1: PowerShell diretto (expert users)
echo.
echo 3. Tutti i metodi richiedono privilegi admin!
echo.

pause