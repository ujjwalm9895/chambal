Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Restore Local Database Credentials" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location "$PSScriptRoot\backend"

Write-Host "Restoring local development credentials..." -ForegroundColor Yellow
Write-Host ""

# Generate SECRET_KEY
$secretKey = python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())" 2>$null

# Create .env content
$envContent = @"
# Django Settings
SECRET_KEY=$secretKey
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Configuration
DB_NAME=chambal_sandesh
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=3306

# Email (Optional)
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_HOST_USER=your-email@gmail.com
# EMAIL_HOST_PASSWORD=your-email-password
# EMAIL_USE_TLS=True
"@

# Write to .env file
$envContent | Out-File -FilePath ".env" -Encoding utf8 -Force

Write-Host "[OK] .env file restored with local credentials" -ForegroundColor Green
Write-Host ""
Write-Host "Current settings:" -ForegroundColor Cyan
Write-Host "  DB_NAME=chambal_sandesh"
Write-Host "  DB_USER=root"
Write-Host "  DB_PASSWORD=<empty>"
Write-Host "  DEBUG=True"
Write-Host ""
Write-Host "If your MySQL root user has a password, edit .env and add it:" -ForegroundColor Yellow
Write-Host "  DB_PASSWORD=your_password"
Write-Host ""
Read-Host "Press Enter to continue"
