# PowerShell script to create database if it doesn't exist
$env:PGPASSWORD = "ujjwal@12"
$connectionString = "postgresql://postgres:ujjwal%4012@localhost:5432/postgres?schema=public"

Write-Host "Attempting to create database cms_db..."

# Try using psql if available
$psqlPath = Get-Command psql -ErrorAction SilentlyContinue
if ($psqlPath) {
    & psql -U postgres -d postgres -c "CREATE DATABASE cms_db;" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Database cms_db created successfully!"
    } else {
        Write-Host "Database might already exist or there was an error."
    }
} else {
    Write-Host "psql not found. Please create the database manually in pgAdmin:"
    Write-Host "1. Open pgAdmin"
    Write-Host "2. Connect to PostgreSQL server"
    Write-Host "3. Right-click Databases → Create → Database"
    Write-Host "4. Name: cms_db"
    Write-Host "5. Click Save"
}
