# 🚀 Activate GitHub Actions CI/CD Pipeline

This guide will help you activate the GitHub Actions CI/CD pipeline for your Eksetasi platform.

## ✅ Prerequisites Checklist

Before starting, ensure you have:

- [ ] GitHub account
- [ ] Git installed locally
- [ ] Repository pushed to GitHub
- [ ] Vercel account (optional, for deployment)
- [ ] Database hosting (PostgreSQL)

## 📋 Step-by-Step Activation

### Step 1: Push Code to GitHub

1. **Add all files to Git:**

   ```bash
   cd mcq-exam-system
   git add .
   git commit -m "Add GitHub Actions CI/CD pipeline"
   ```

2. **Create GitHub repository** (if not already done):

   - Go to https://github.com/new
   - Create a new repository named `eksetasi`
   - Don't initialize with README (since you already have code)

3. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/eksetasi.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Configure GitHub Repository Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

**Add these Repository Secrets:**

#### Database Configuration

```
STAGING_DATABASE_URL
Value: postgresql://user:password@host:5432/staging_db?schema=public

PRODUCTION_DATABASE_URL
Value: postgresql://user:password@host:5432/production_db?schema=public
```

#### JWT Secrets

```
STAGING_JWT_SECRET
Value: your-super-secure-staging-jwt-secret-here

PRODUCTION_JWT_SECRET
Value: your-super-secure-production-jwt-secret-here
```

#### Vercel Configuration (Optional)

```
VERCEL_TOKEN
Value: your-vercel-token

VERCEL_ORG_ID
Value: your-vercel-org-id

VERCEL_PROJECT_ID
Value: your-vercel-project-id
```

#### Health Check URLs

```
STAGING_URL
Value: https://your-staging-domain.vercel.app

PRODUCTION_URL
Value: https://your-production-domain.vercel.app
```

### Step 3: Set Up GitHub Environments (Recommended)

1. **Go to:** Repository → Settings → Environments
2. **Create `staging` environment:**

   - Click "New environment"
   - Name: `staging`
   - No protection rules needed

3. **Create `production` environment:**
   - Click "New environment"
   - Name: `production`
   - Enable "Required reviewers" (add yourself)
   - Enable "Wait timer" (optional, e.g., 5 minutes)

### Step 4: Set Up Vercel (Optional but Recommended)

1. **Install Vercel CLI:**

   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**

   ```bash
   vercel login
   ```

3. **Link your project:**

   ```bash
   cd eksetasi
   vercel link
   ```

4. **Get Vercel information:**

   ```bash
   vercel whoami
   # Note your username/org

   # Get project info from .vercel/project.json
   cat .vercel/project.json
   ```

5. **Get Vercel token:**
   - Go to https://vercel.com/account/tokens
   - Create a new token
   - Copy the token for GitHub Secrets

### Step 5: Set Up Database Hosting

#### Option A: Vercel Postgres (Recommended)

1. Go to your Vercel dashboard
2. Select your project
3. Go to Storage tab
4. Create a Postgres database
5. Copy the connection strings for staging/production

#### Option B: Railway

1. Go to https://railway.app
2. Create a new project
3. Add PostgreSQL service
4. Copy connection string

#### Option C: Supabase

1. Go to https://supabase.com
2. Create new project
3. Go to Settings → Database
4. Copy connection string

### Step 6: Test the Pipeline

1. **Create a test branch:**

   ```bash
   git checkout -b test-cicd
   ```

2. **Make a small change:**

   ```bash
   echo "# CI/CD Test" >> README.md
   git add README.md
   git commit -m "Test CI/CD pipeline"
   git push origin test-cicd
   ```

3. **Create Pull Request:**

   - Go to GitHub repository
   - Click "Compare & pull request"
   - Create the PR
   - Watch the CI pipeline run in the "Checks" tab

4. **Merge to trigger staging deployment:**

   - Merge the PR
   - Watch the CD pipeline deploy to staging

5. **Create production release:**
   ```bash
   git checkout main
   git pull origin main
   git tag v1.0.0
   git push origin v1.0.0
   ```
   - Watch the production deployment (requires approval if you set up environments)

## 🔧 Configuration Examples

### Example .env for local development

```env
DATABASE_URL="postgresql://mcq_user:mcq_password@localhost:5432/mcq_exam_system?schema=public"
JWT_SECRET="your-local-jwt-secret"
NODE_ENV="development"
```

### Example Vercel Environment Variables

In your Vercel dashboard, add these environment variables:

- `DATABASE_URL` → Your production database URL
- `JWT_SECRET` → Your production JWT secret
- `NODE_ENV` → `production`

## 🚨 Troubleshooting

### Common Issues

#### 1. CI Pipeline Fails

- Check the Actions tab in GitHub
- Look for specific error messages
- Ensure all dependencies are in package.json

#### 2. Database Connection Fails

- Verify DATABASE_URL format
- Ensure database is accessible from GitHub Actions
- Check if database exists

#### 3. Vercel Deployment Fails

- Verify Vercel tokens are correct
- Check Vercel project settings
- Ensure build command works locally

#### 4. Secrets Not Working

- Verify secret names match exactly
- Check for extra spaces in secret values
- Ensure secrets are set in the correct repository

### Getting Help

1. **Check GitHub Actions logs:**

   - Repository → Actions → Click on failed workflow

2. **Test locally:**

   ```bash
   npm run lint
   npm run type-check
   npm run build
   ```

3. **Verify environment:**
   ```bash
   npm run health
   ```

## ✅ Success Indicators

You'll know the pipeline is working when:

- [ ] CI pipeline runs on pull requests
- [ ] All checks pass (green checkmarks)
- [ ] Staging deploys automatically on main branch
- [ ] Production deploys on version tags
- [ ] Health checks pass after deployment
- [ ] You receive deployment notifications

## 🎉 Next Steps

Once activated:

1. Set up monitoring and alerts
2. Add more comprehensive tests
3. Configure branch protection rules
4. Set up automated dependency updates
5. Add performance monitoring

---

**Need help?** Check the GitHub Actions logs or refer to the `GITHUB_ACTIONS_GUIDE.md` for detailed documentation.
