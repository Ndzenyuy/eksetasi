# 🎓 Eksetasi

A modern, full-stack online examination platform built with Next.js 15, TypeScript, PostgreSQL, and Prisma ORM. Perfect for educational institutions, training organizations, and online learning platforms.

## ✨ Features

### 🔐 Authentication & Authorization
- Secure JWT-based authentication
- Role-based access control (Student, Teacher, Admin)
- Protected routes and middleware

### 👥 Multi-Role Dashboards
- **Student Dashboard**: Take exams, view results, track progress
- **Teacher Dashboard**: Create questions, manage exams, view analytics
- **Admin Dashboard**: Complete system management, user administration

### 📝 Exam Management
- Interactive exam interface with timer
- Real-time progress tracking
- Auto-save functionality
- Comprehensive result analytics
- Detailed answer review with explanations

### 🛠️ Admin Panel
- Complete CRUD operations for questions, exams, and users
- Advanced filtering and search capabilities
- Performance analytics and reporting
- Bulk operations and data management

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JWT with secure session management
- **Validation**: Zod schemas
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel, Docker support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/eksetasi.git
   cd eksetasi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Set up database**
   ```bash
   # Using the automated script
   ./scripts/setup-db.sh

   # Or manually
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Test Accounts
After seeding, you can use these accounts:
- **Admin**: admin@example.com / admin123
- **Teacher**: teacher@example.com / teacher123
- **Student**: student@example.com / student123

## 🚀 CI/CD Pipeline

This project includes a complete GitHub Actions CI/CD pipeline for automated testing and deployment.

### Pipeline Features
- **Continuous Integration**: Automated testing, linting, and security checks
- **Continuous Deployment**: Automatic deployment to staging and production
- **Health Monitoring**: Post-deployment health checks
- **Environment Management**: Separate staging and production environments

### Setup CI/CD
1. **Generate secrets**: `node generate-secrets.js`
2. **Configure GitHub Secrets**: Add database URLs and JWT secrets
3. **Follow activation guide**: See `activate-cicd.md`
4. **Track progress**: Use `ACTIVATION_CHECKLIST.md`

### Workflow
```
Feature Branch → Pull Request → CI Tests → Merge to Main → Staging Deployment
                                                              ↓
Production Tag → Production Deployment → Health Check → Success ✅
```

## 📁 Project Structure

```
eksetasi/
├── .github/workflows/     # GitHub Actions CI/CD pipelines
├── app/                   # Next.js app directory
│   ├── (auth)/           # Authentication pages
│   ├── admin/            # Admin dashboard
│   ├── api/              # API routes
│   ├── components/       # Reusable components
│   ├── dashboard/        # User dashboard
│   ├── exams/            # Exam pages
│   └── teacher/          # Teacher dashboard
├── lib/                  # Utility libraries
│   ├── api/              # API utilities
│   ├── auth/             # Authentication logic
│   └── validations/      # Zod schemas
├── prisma/               # Database schema and migrations
├── scripts/              # Setup and utility scripts
└── public/               # Static assets
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
npm run type-check      # Check TypeScript

# Database
npm run db:generate     # Generate Prisma client
npm run db:migrate      # Run database migrations
npm run db:seed         # Seed database with test data
npm run db:studio       # Open Prisma Studio

# Health & Testing
npm run health          # Check application health
npm test               # Run tests (when implemented)
```

## 🌐 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main

### Manual Deployment
1. Build the application: `npm run build`
2. Start the server: `npm start`
3. Ensure database is accessible

## 📚 Documentation

- **[GitHub Actions Guide](GITHUB_ACTIONS_GUIDE.md)** - Complete CI/CD documentation
- **[Activation Guide](activate-cicd.md)** - Step-by-step setup instructions
- **[Activation Checklist](ACTIVATION_CHECKLIST.md)** - Track your progress
- **[Setup Guide](SETUP_GUIDE.md)** - Detailed installation guide
- **[Project Status](PROJECT_STATUS.md)** - Development progress

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- Check the [documentation](GITHUB_ACTIONS_GUIDE.md)
- Review [troubleshooting guide](activate-cicd.md#troubleshooting)
- Open an issue for bugs or feature requests

## 🎯 Project Status

✅ **Production Ready** - Complete online examination platform with full CI/CD pipeline

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-green?logo=github)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
