@echo off
echo ========================================
echo Restore Local Database Credentials
echo ========================================
echo.

cd /d %~dp0backend

echo Restoring local development credentials...
echo.

REM Generate SECRET_KEY
python -c "from django.core.management.utils import get_random_secret_key; print('SECRET_KEY=' + get_random_secret_key())" > temp_secret.txt
set /p SECRET_KEY=<temp_secret.txt
del temp_secret.txt

REM Create .env file with local credentials
(
    echo # Django Settings
    echo %SECRET_KEY%
    echo DEBUG=True
    echo ALLOWED_HOSTS=localhost,127.0.0.1
    echo.
    echo # Database Configuration
    echo DB_NAME=chambal_sandesh
    echo DB_USER=root
    echo DB_PASSWORD=
    echo DB_HOST=localhost
    echo DB_PORT=3306
    echo.
    echo # Email ^(Optional^)
    echo # EMAIL_HOST=smtp.gmail.com
    echo # EMAIL_PORT=587
    echo # EMAIL_HOST_USER=your-email@gmail.com
    echo # EMAIL_HOST_PASSWORD=your-email-password
    echo # EMAIL_USE_TLS=True
) > .env

echo [OK] .env file restored with local credentials
echo.
echo Current settings:
echo   DB_NAME=chambal_sandesh
echo   DB_USER=root
echo   DB_PASSWORD=^<empty^>
echo   DEBUG=True
echo.
echo If your MySQL root user has a password, edit .env and add it:
echo   DB_PASSWORD=your_password
echo.
pause
