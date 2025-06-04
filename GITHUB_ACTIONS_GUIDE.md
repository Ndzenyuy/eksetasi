# GitHub Actions CI/CD Pipeline for Eksetasi

This guide explains the GitHub Actions CI/CD pipeline setup for Eksetasi.

## 🏗️ Pipeline Overview

Our GitHub Actions pipeline consists of:

1. **CI Pipeline** (`ci.yml`) - Continuous Integration
2. **CD Pipeline** (`cd.yml`) - Continuous Deployment

## 📁 Files Structure

```
eksetasi/
├── .github/workflows/
│   ├── ci.yml                 # Continuous Integration pipeline
│   └── cd.yml                 # Continuous Deployment pipeline
├── .env.example              # Environment variables template
└── app/api/health/route.ts   # Health check endpoint
```

## 🔄 CI Pipeline (Continuous Integration)

**File:** `.github/workflows/ci.yml`

### Triggers
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

### Jobs

#### 1. **Code Quality & Linting**
- ESLint code quality checks
- TypeScript type checking

#### 2. **Security Audit**
- npm audit for vulnerabilities
- Dependency security scanning

#### 3. **Database Tests**
- PostgreSQL service setup
- Database migration testing
- Schema validation

#### 4. **Build & Test**
- Application build verification
- Artifact generation for deployment

#### 5. **Build Summary**
- Overall pipeline status check
- Success/failure reporting

## 🚀 CD Pipeline (Continuous Deployment)

**File:** `.github/workflows/cd.yml`

### Triggers
- Successful CI pipeline completion on `main` branch
- Git tags starting with `v` (e.g., `v1.0.0`)

### Jobs

#### 1. **Deploy to Staging**
- Automatic deployment on `main` branch
- Vercel deployment for staging environment
- Testing environment for validation

#### 2. **Deploy to Production**
- Manual approval required (GitHub Environments)
- Triggered by version tags
- Database migrations
- Production deployment to Vercel

#### 3. **Notification**
- Deployment status notifications
- Success/failure reporting

#### 4. **Health Check**
- Post-deployment health verification
- API endpoint testing

## 🔧 Setup Instructions

### 1. GitHub Repository Setup

1. **Enable GitHub Actions**
   - Actions are enabled by default in most repositories
   - Check Settings > Actions > General

2. **Configure Repository Secrets**
   Go to Settings > Secrets and variables > Actions and add:

   ```
   # Database URLs
   STAGING_DATABASE_URL=postgresql://user:pass@host:5432/staging_db
   PRODUCTION_DATABASE_URL=postgresql://user:pass@host:5432/prod_db
   
   # JWT Secrets
   STAGING_JWT_SECRET=your-staging-jwt-secret
   PRODUCTION_JWT_SECRET=your-production-jwt-secret
   
   # Vercel Deployment (if using Vercel)
   VERCEL_TOKEN=your-vercel-token
   VERCEL_ORG_ID=your-vercel-org-id
   VERCEL_PROJECT_ID=your-vercel-project-id
   
   # Health Check URLs
   STAGING_URL=https://your-staging-domain.com
   PRODUCTION_URL=https://your-production-domain.com
   ```

3. **Configure Environments** (Optional but recommended)
   - Go to Settings > Environments
   - Create `staging` and `production` environments
   - Add protection rules for production (require reviews)

### 2. Environment Configuration

1. **Copy environment template**
   ```bash
   cp .env.example .env
   ```

2. **Configure for each environment**
   - Development: `.env`
   - Use GitHub Secrets for staging/production

### 3. Vercel Setup (Recommended for Next.js)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Link your project**
   ```bash
   vercel link
   ```

3. **Get Vercel tokens**
   ```bash
   vercel whoami
   # Get your org ID and project ID from Vercel dashboard
   ```

## 🚦 Deployment Workflow

### Development to Production

1. **Feature Development**
   ```bash
   git checkout -b feature/new-feature
   # Develop feature
   git push origin feature/new-feature
   # Create pull request to main
   ```

2. **Code Review & Testing**
   - CI pipeline runs automatically on PR
   - Code review process
   - Merge to `main` branch

3. **Staging Deployment**
   - Automatic deployment to staging on merge to `main`
   - Testing and validation in staging environment

4. **Production Release**
   ```bash
   git checkout main
   git pull origin main
   git tag v1.0.0
   git push origin v1.0.0
   # Production deployment triggered by tag
   ```

## 📊 Monitoring & Health Checks

### Health Check Endpoint
The pipeline includes automated health checks using the `/api/health` endpoint:

```
GET /api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0",
  "environment": "production",
  "uptime": 3600,
  "memory": {
    "used": 128,
    "total": 256
  },
  "database": {
    "status": "connected",
    "type": "postgresql"
  },
  "services": {
    "api": "operational",
    "auth": "operational",
    "database": "operational"
  }
}
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. CI Pipeline Failures
- **Linting errors**: Fix ESLint issues locally
- **Type errors**: Fix TypeScript compilation errors
- **Build failures**: Check build logs in Actions tab

#### 2. Database Connection Issues
- Verify `DATABASE_URL` secrets are correct
- Ensure database is accessible from GitHub Actions
- Check database migration files

#### 3. Deployment Failures
- Verify Vercel tokens and project configuration
- Check environment variables in GitHub Secrets
- Review deployment logs in Actions tab

#### 4. Health Check Failures
- Ensure health endpoint is accessible
- Check application startup time
- Verify database connectivity

### Debugging Steps

1. **Check GitHub Actions logs**
   - Go to Actions tab in your repository
   - Click on failed workflow
   - Review step-by-step logs

2. **Test locally**
   ```bash
   npm run lint
   npm run type-check
   npm run build
   npm run health
   ```

3. **Verify environment variables**
   - Check GitHub Secrets configuration
   - Ensure all required secrets are set
   - Verify secret names match workflow files

## 🔐 Security Best Practices

### Secrets Management
- Never commit secrets to repository
- Use GitHub Secrets for sensitive data
- Rotate secrets regularly
- Use environment-specific secrets

### Database Security
- Use strong passwords
- Enable SSL connections
- Restrict database access
- Regular security updates

### Application Security
- Keep dependencies updated
- Run security audits regularly
- Use HTTPS for all environments
- Implement proper authentication

## 📈 Performance Optimization

### Build Optimization
- Use npm ci for faster installs
- Cache node_modules between runs
- Optimize build artifacts

### Pipeline Optimization
- Run jobs in parallel where possible
- Use build artifacts between jobs
- Minimize redundant operations

## 🔄 Continuous Improvement

### Metrics to Monitor
- Build times
- Deployment frequency
- Failure rates
- Recovery times

### Regular Tasks
- Update GitHub Actions versions
- Review and update dependencies
- Optimize pipeline performance
- Monitor security vulnerabilities

---

This GitHub Actions pipeline provides a robust, automated CI/CD process for Eksetasi, ensuring reliable and consistent deployments with proper testing and validation at each stage.
