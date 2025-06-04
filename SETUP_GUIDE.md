# Eksetasi - Complete Setup Guide

This guide will walk you through setting up Eksetasi with PostgreSQL database and all required dependencies.

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

**For Linux/macOS:**
```bash
# Make setup script executable and run
chmod +x scripts/setup-db.sh
./scripts/setup-db.sh
```

**For Windows:**
```cmd
# Run the batch script
scripts\setup-db.bat
```

### Option 2: Manual Setup

Follow the detailed steps below if you prefer manual setup or encounter issues with the automated script.

## 📋 Prerequisites

1. **Node.js** (v18 or higher)
   - Download: https://nodejs.org/

2. **PostgreSQL** (v12 or higher) OR **Docker**
   - PostgreSQL: https://www.postgresql.org/download/
   - Docker: https://docs.docker.com/get-docker/

3. **Git** (for cloning the repository)
   - Download: https://git-scm.com/

## 🛠️ Manual Installation Steps

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/eksetasi.git
cd eksetasi

# Install Node.js dependencies
npm install
```

### 2. Database Setup

#### Option A: Using Docker (Recommended for Development)

```bash
# Start PostgreSQL with Docker Compose
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
docker-compose logs postgres
```

#### Option B: Using Local PostgreSQL

```bash
# Create database (run in PostgreSQL shell)
createdb eksetasi

# Or using SQL
psql -U postgres -c "CREATE DATABASE eksetasi;"
```

### 3. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your database credentials
# For Docker setup:
DATABASE_URL="postgresql://eksetasi_user:eksetasi_password@localhost:5432/eksetasi?schema=public"
JWT_SECRET="your-super-secure-jwt-secret-here"

# For local PostgreSQL:
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/eksetasi?schema=public"
JWT_SECRET="your-super-secure-jwt-secret-here"

# Generate a secure JWT secret:
# node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 4. Database Migration and Seeding

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed database with sample data
npm run db:seed
```

### 5. Start Development Server

```bash
# Start the Next.js development server
npm run dev
```

Visit http://localhost:3000 to access the application.

## 🧪 Test Accounts

After seeding, you can use these accounts:

|   Role  |         Email       |  Password  |
|---------|---------------------|------------|
|  Admin  | admin@example.com   | admin123   |
| Teacher | teacher@example.com | teacher123 |
| Student | student@example.com | student123 |

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:generate     # Generate Prisma client
npm run db:push         # Push schema to database
npm run db:migrate      # Run migrations
npm run db:seed         # Seed database
npm run db:studio       # Open Prisma Studio

# Utilities
npm run lint            # Run ESLint
npm run type-check      # Check TypeScript
npm run health          # Check application health
```

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs postgres

# Access database shell
docker-compose exec postgres psql -U eksetasi_user -d eksetasi
```

## 🌐 Access Points

- **Application**: http://localhost:3000
- **Prisma Studio**: http://localhost:5555 (run `npm run db:studio`)
- **Adminer** (if using Docker): http://localhost:8080

## 🔍 Troubleshooting

### Database Connection Issues

**Error: "Connection refused"**
```bash
# Check if PostgreSQL is running
pg_isready -h localhost -p 5432

# For Docker
docker-compose ps
```

**Error: "Database does not exist"**
```bash
# Create database manually
createdb eksetasi

# Or reset everything
npx prisma migrate reset
```

### Migration Issues

**Error: "Migration failed"**
```bash
# Reset database and migrations
npx prisma migrate reset

# Generate client and migrate
npx prisma generate
npx prisma migrate dev --name init
```

### Port Conflicts

**Error: "Port 3000 already in use"**
```bash
# Use different port
PORT=3001 npm run dev
```

**Error: "Port 5432 already in use"**
```bash
# Stop existing PostgreSQL
sudo service postgresql stop

# Or use different port in docker-compose.yml
```

### Permission Issues

**Error: "Permission denied"**
```bash
# Make scripts executable
chmod +x scripts/setup-db.sh

# Fix ownership (Linux/macOS)
sudo chown -R $USER:$USER .
```

## 🚀 Production Deployment

### Environment Variables

```bash
# Production environment variables
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-super-secure-jwt-secret"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="https://your-domain.com"
```

### Build and Deploy

```bash
# Build for production
npm run build

# Start production server
npm start

# Or deploy to Vercel/Netlify/etc.
```

## � CI/CD Setup

For automated deployments, see:
- **[GitHub Actions Guide](GITHUB_ACTIONS_GUIDE.md)** - Complete CI/CD setup
- **[Activation Guide](activate-cicd.md)** - Step-by-step activation
- **[VS Code Guide](QUICK_START_VSCODE.md)** - VS Code integration

## �📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Vercel Deployment](https://vercel.com/docs)

## 🆘 Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Review the logs: `docker-compose logs` or `npm run dev`
3. Ensure all prerequisites are installed
4. Try the automated setup script
5. Reset everything and start fresh

## 📝 Notes

- The setup script automatically detects your environment and chooses the best setup method
- Docker setup is recommended for development as it's more consistent across different systems
- Make sure to change default passwords in production
- Regular database backups are recommended for production use

## 🎯 Quick Verification

After setup, verify everything is working:

```bash
# Check if application starts
npm run dev

# Check database connection
npm run health

# Check if you can access the application
# Visit: http://localhost:3000
# Login with: admin@example.com / admin123
```

## 🔗 Related Documentation

- **[Project Status](PROJECT_STATUS.md)** - Development progress
- **[GitHub Actions Guide](GITHUB_ACTIONS_GUIDE.md)** - CI/CD setup
- **[VS Code Guide](QUICK_START_VSCODE.md)** - Development environment
