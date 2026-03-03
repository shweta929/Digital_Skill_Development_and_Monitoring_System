@echo off
echo ============================================
echo   Career Portal - Dependency Check
echo ============================================
echo.

echo 1. Checking Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (echo [ERROR] Node.js not found!) else (echo [OK] Node.js found.)

echo 2. Checking Java...
java -version >nul 2>&1
if %errorlevel% neq 0 (echo [ERROR] Java not found!) else (echo [OK] Java found.)

echo 3. Checking .NET SDK...
dotnet --version >nul 2>&1
if %errorlevel% neq 0 (echo [ERROR] .NET SDK not found!) else (echo [OK] .NET SDK found.)

echo 4. Checking MongoDB...
sc query MongoDB >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] MongoDB service not found. Ensure it is installed and running on port 27017.
) else (
    echo [OK] MongoDB service exists.
)

echo 5. Checking MySQL...
sc query MySQL >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] MySQL service not found. Ensure it is installed and running on port 3306.
) else (
    echo [OK] MySQL service exists.
)

echo.
echo ============================================
echo   Check complete.
echo ============================================
pause
