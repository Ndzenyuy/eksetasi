@echo off
echo 🚀 Setting up PostgreSQL database for Eksetasi...

REM Check if .env file exists
if not exist .env (
    echo ❌ .env file not found. Please create .env file with DATABASE_URL.
    pause
    exit /b 1
)

REM Check if Docker is available
docker --version >nul 2>&1
if %errorlevel% equ 0 (
    docker-compose --version >nul 2>&1
    if %errorlevel% equ 0 (
        set USE_DOCKER=true
        echo 🐳 Using Docker for PostgreSQL...
        goto :start_docker
    )
)

REM Check if PostgreSQL is available locally
pg_isready -h localhost -p 5432 >nul 2>&1
if %errorlevel% equ 0 (
    set USE_DOCKER=false
    echo ✅ PostgreSQL detected running locally
    goto :setup_database
)

echo ❌ Neither PostgreSQL nor Docker found.
echo Please install one of the following:
echo   1. PostgreSQL: https://www.postgresql.org/download/
echo   2. Docker: https://docs.docker.com/get-docker/
pause
exit /b 1

:start_docker
echo 🐳 Starting PostgreSQL with Docker...
docker-compose up -d postgres

echo ⏳ Waiting for PostgreSQL to be ready...
:wait_loop
timeout /t 2 /nobreak >nul
docker-compose exec postgres pg_isready -U mcq_user -d mcq_exam_system >nul 2>&1
if %errorlevel% neq 0 goto :wait_loop
echo ✅ PostgreSQL is ready!

:setup_database
echo 🔄 Generating Prisma client...
call npx prisma generate

echo 📋 Running Prisma migrations...
call npx prisma migrate dev --name init

echo 🌱 Seeding database with initial data...
call npm run db:seed

echo ✅ Database setup completed successfully!
echo.
echo 🎉 You can now:
echo    - Start the development server: npm run dev
echo    - View the database: npm run db:studio
if "%USE_DOCKER%"=="true" (
    echo    - Access Adminer (DB GUI): http://localhost:8080
    echo    - Stop database: docker-compose down
)
echo    - Reset the database: npx prisma migrate reset
echo.
echo 📝 Test accounts created:
echo    Admin: admin@example.com / admin123
echo    Teacher: teacher@example.com / teacher123
echo    Student: student@example.com / student123
pause
