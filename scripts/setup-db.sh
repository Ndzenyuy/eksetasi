#!/bin/bash

echo "🚀 Setting up PostgreSQL database for MCQ Exam System..."

# Function to check if Docker is available
check_docker() {
    if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
        return 0
    else
        return 1
    fi
}

# Function to check if PostgreSQL is running locally
check_postgres() {
    if command -v psql &> /dev/null; then
        if pg_isready -h localhost -p 5432 &> /dev/null; then
            return 0
        fi
    fi
    return 1
}

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please create .env file with DATABASE_URL."
    exit 1
fi

# Determine setup method
if check_postgres; then
    echo "✅ PostgreSQL detected running locally"
    USE_DOCKER=false
elif check_docker; then
    echo "🐳 PostgreSQL not found locally, using Docker..."
    USE_DOCKER=true
else
    echo "❌ Neither PostgreSQL nor Docker found."
    echo "Please install one of the following:"
    echo "  1. PostgreSQL: https://www.postgresql.org/download/"
    echo "  2. Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# Start PostgreSQL with Docker if needed
if [ "$USE_DOCKER" = true ]; then
    echo "🐳 Starting PostgreSQL with Docker..."
    docker-compose up -d postgres

    echo "⏳ Waiting for PostgreSQL to be ready..."
    timeout=60
    while ! docker-compose exec postgres pg_isready -U mcq_user -d mcq_exam_system &> /dev/null; do
        sleep 2
        timeout=$((timeout - 2))
        if [ $timeout -le 0 ]; then
            echo "❌ Timeout waiting for PostgreSQL to start"
            exit 1
        fi
    done
    echo "✅ PostgreSQL is ready!"
fi

echo "🔄 Generating Prisma client..."
npx prisma generate

echo "📋 Running Prisma migrations..."
npx prisma migrate dev --name init

echo "🌱 Seeding database with initial data..."
npm run db:seed

echo "✅ Database setup completed successfully!"
echo ""
echo "🎉 You can now:"
echo "   - Start the development server: npm run dev"
echo "   - View the database: npm run db:studio"
if [ "$USE_DOCKER" = true ]; then
    echo "   - Access Adminer (DB GUI): http://localhost:8080"
    echo "   - Stop database: docker-compose down"
fi
echo "   - Reset the database: npx prisma migrate reset"
echo ""
echo "📝 Test accounts created:"
echo "   Admin: admin@example.com / admin123"
echo "   Teacher: teacher@example.com / teacher123"
echo "   Student: student@example.com / student123"
