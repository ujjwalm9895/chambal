Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Fix MySQL Root Password" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "The error shows MySQL root user requires a password." -ForegroundColor Yellow
Write-Host ""

Write-Host "Option 1: If you know your MySQL root password" -ForegroundColor Green
Write-Host "  Enter it below and I'll update .env file"
Write-Host ""
$password = Read-Host "Enter MySQL root password (or press Enter to skip)"

if ($password) {
    Write-Host ""
    Write-Host "Updating .env file..." -ForegroundColor Yellow
    
    Set-Location "$PSScriptRoot\backend"
    
    # Read current .env
    $envContent = Get-Content .env -Raw
    
    # Update DB_PASSWORD
    $envContent = $envContent -replace "DB_PASSWORD=", "DB_PASSWORD=$password"
    
    # Write back
    $envContent | Out-File -FilePath ".env" -Encoding utf8 -Force
    
    Write-Host "[OK] .env file updated with password" -ForegroundColor Green
    Write-Host ""
    Write-Host "Testing connection..." -ForegroundColor Yellow
    
    # Test connection
    .\venv\Scripts\activate
    python manage.py check --database default 2>&1 | Select-Object -First 5
    
} else {
    Write-Host ""
    Write-Host "Option 2: Reset MySQL root password" -ForegroundColor Green
    Write-Host ""
    Write-Host "If you don't remember your password, you can reset it:"
    Write-Host ""
    Write-Host "1. Stop MySQL service:" -ForegroundColor Cyan
    Write-Host "   net stop MySQL80"
    Write-Host "   (or: net stop MySQL)"
    Write-Host ""
    Write-Host "2. Start MySQL in safe mode:"
    Write-Host "   mysqld --init-file=C:\reset.txt --console"
    Write-Host ""
    Write-Host "3. Create reset.txt file with:"
    Write-Host "   ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword';"
    Write-Host ""
    Write-Host "4. Restart MySQL service normally"
    Write-Host ""
    Write-Host "OR use MySQL Workbench / XAMPP Control Panel to reset password"
    Write-Host ""
}

Write-Host ""
Write-Host "Option 3: Create new MySQL user for Django" -ForegroundColor Green
Write-Host ""
Write-Host "If you have MySQL root access via GUI (phpMyAdmin, MySQL Workbench, etc.):"
Write-Host ""
Write-Host "Run these SQL commands:"
Write-Host "  CREATE DATABASE chambal_sandesh CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
Write-Host "  CREATE USER 'django_user'@'localhost' IDENTIFIED BY 'django123';"
Write-Host "  GRANT ALL PRIVILEGES ON chambal_sandesh.* TO 'django_user'@'localhost';"
Write-Host "  FLUSH PRIVILEGES;"
Write-Host ""
Write-Host "Then update .env with:"
Write-Host "  DB_USER=django_user"
Write-Host "  DB_PASSWORD=django123"
Write-Host ""

Read-Host "Press Enter to exit"
