# Script per convertire gli installer in .EXE
# Richiede PSScriptToExe (https://github.com/klothe/PSScriptToExe)

param(
    [Parameter(Mandatory=$false)]
    [string]$PSScriptToExePath = "C:\PSScriptToExe.exe",

    [Parameter(Mandatory=$false)]
    [string]$OutputPath = (Split-Path -Parent $MyInvocation.MyCommand.Path)
)

Write-Host "🔧 Converting PowerShell scripts to EXE..." -ForegroundColor Cyan

$sourceScript = Join-Path $OutputPath "MT5_Auto_Installer.ps1"
$finalExe = Join-Path $OutputPath "MT5_Auto_Installer.exe"

# Verifica se PSScriptToExe esiste
if (-not (Test-Path $PSScriptToExePath)) {
    Write-Warning "PSScriptToExe not found at: $PSScriptToExePath"
    Write-Host ""
    Write-Host "📥 DOWNLOAD MANUALMENTE PSScriptToExe:" -ForegroundColor Yellow
    Write-Host "1. Visita: https://github.com/klothe/PSScriptToExe" -ForegroundColor White
    Write-Host "2. Scarica PSScriptToExe.zip" -ForegroundColor White
    Write-Host "3. Estrai PSScriptToExe.exe nella directory C:\" -ForegroundColor White
    Write-Host "4. Riavvia questo script" -ForegroundColor White
    Write-Host ""
    Read-Host "Premi ENTER dopo aver scaricato PSScriptToExe"
    return
}

# Verifica se lo script PowerShell esiste
if (-not (Test-Path $sourceScript)) {
    Write-Error "MT5_Auto_Installer.ps1 not found in: $OutputPath"
    return
}

Write-Host "📁 Source: $sourceScript" -ForegroundColor White
Write-Host "📁 Output: $finalExe" -ForegroundColor White
Write-Host ""

# Converti in EXE
Write-Host "⚙️ Converting script to EXE..." -ForegroundColor Yellow

$arguments = @(
    "-i:`"$sourceScript`"",
    "-o:`"$finalExe`"",
    "-n:",  # Nasconde PowerShell console
    "-r:",  # Richiede esecuzione come admin
    "-v:"   # Verboso
)

try {
    $process = Start-Process -FilePath $PSScriptToExePath -ArgumentList $arguments -Wait -NoNewWindow -PassThru

    if ($process.ExitCode -eq 0) {
        Write-Host ""
        Write-Host "✅ EXE Created Successfully!" -ForegroundColor Green
        Write-Host "📁 Location: $finalExe" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "ℹ️ To create another .EXE, run:" -ForegroundColor White
        Write-Host "    .\Convert_To_EXE.ps1" -ForegroundColor Gray
        Write-Host ""
    } else {
        Write-Error "Failed to create EXE (Exit code: $($process.ExitCode))"
    }
} catch {
    Write-Error "Error creating EXE: $($_.Exception.Message)"
}

Write-Host ""
Read-Host "Press Enter to exit"