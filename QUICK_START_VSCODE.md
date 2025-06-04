# 🚀 Quick Start: VS Code + GitHub Actions

Get up and running with VS Code and GitHub Actions for your Eksetasi platform in minutes!

## 📦 Step 1: Install Required Extensions

Open VS Code and install these extensions:

1. **GitHub Actions** (by GitHub) - Essential for CI/CD management
2. **YAML** (by Red Hat) - For workflow file editing
3. **GitHub Pull Requests and Issues** (by GitHub) - For GitHub integration
4. **Tailwind CSS IntelliSense** (by Tailwind Labs) - For styling
5. **Prisma** (by Prisma) - For database schema

**Quick Install:**
- Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
- Type: `Extensions: Show Recommended Extensions`
- Install all recommended extensions

## 🔧 Step 2: Open Your Project

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/eksetasi.git
   cd eksetasi
   ```

2. **Open in VS Code:**
   ```bash
   code .
   ```

3. **Install dependencies:**
   - Open terminal in VS Code (`Ctrl+``)
   - Run: `npm install`

## 🎯 Step 3: Explore GitHub Actions Integration

### View Workflows
1. **Open GitHub Actions panel** (sidebar icon)
2. **Sign in to GitHub** when prompted
3. **View your workflows:**
   - CI Pipeline (ci.yml)
   - CD Pipeline (cd.yml)

### Edit Workflows
1. **Navigate to** `.github/workflows/`
2. **Open `ci.yml`** - Notice syntax highlighting and IntelliSense
3. **Open `cd.yml`** - See deployment configuration

### Monitor Runs
1. **Push a change** to trigger workflows
2. **Watch real-time execution** in the GitHub Actions panel
3. **View detailed logs** by clicking on runs

## 🛠️ Step 4: Use Built-in Tasks

VS Code tasks are pre-configured for common operations:

### Access Tasks
- Press `Ctrl+Shift+P` → `Tasks: Run Task`

### Available Tasks
- **dev** - Start development server
- **build** - Build for production
- **lint** - Run ESLint
- **type-check** - TypeScript validation
- **db:generate** - Generate Prisma client
- **db:migrate** - Run database migrations
- **db:seed** - Seed database
- **Generate Secrets** - Create GitHub secrets
- **Setup Database** - Automated database setup

## 🔐 Step 5: Configure GitHub Secrets

### Generate Secrets
1. **Run task:** `Generate Secrets`
2. **Copy the output** for GitHub configuration

### Add to GitHub
1. **Go to:** Repository → Settings → Secrets and variables → Actions
2. **Add secrets:**
   - `STAGING_JWT_SECRET`
   - `PRODUCTION_JWT_SECRET`
   - `STAGING_DATABASE_URL`
   - `PRODUCTION_DATABASE_URL`

## 🚀 Step 6: Test Your Pipeline

### Create a Test Change
1. **Create new branch:**
   ```bash
   git checkout -b test-vscode-actions
   ```

2. **Make a small change:**
   - Edit `README.md`
   - Add a comment to any file

3. **Commit and push:**
   ```bash
   git add .
   git commit -m "Test VS Code GitHub Actions integration"
   git push origin test-vscode-actions
   ```

### Monitor in VS Code
1. **Open GitHub Actions panel**
2. **Watch CI pipeline execute**
3. **View logs in real-time**
4. **See success/failure status**

### Create Pull Request
1. **Use GitHub Pull Requests extension**
2. **Create PR from VS Code**
3. **Watch checks complete**
4. **Merge when ready**

## 📊 Step 7: Monitor Deployments

### Staging Deployment
1. **Merge PR to main**
2. **Watch CD pipeline trigger**
3. **Monitor staging deployment**
4. **Check health status**

### Production Deployment
1. **Create version tag:**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
2. **Watch production deployment**
3. **Approve if required**
4. **Monitor health checks**

## 🎯 Key VS Code Features for GitHub Actions

### 1. **Workflow File Editing**
- **Syntax highlighting** for YAML
- **IntelliSense** for GitHub Actions
- **Error detection** and validation
- **Auto-completion** for actions and properties

### 2. **Real-time Monitoring**
- **Live workflow status** in sidebar
- **Detailed step logs** inline
- **Failure notifications**
- **Re-run capabilities**

### 3. **Integrated Development**
- **Debug workflows** locally
- **Test changes** before commit
- **Quick access** to logs and status
- **Seamless Git integration**

## 🔧 Troubleshooting

### Common Issues

#### Extension Not Working
1. **Reload VS Code** (`Ctrl+Shift+P` → `Developer: Reload Window`)
2. **Check authentication** (GitHub Actions panel)
3. **Verify repository access**

#### Workflow Syntax Errors
1. **Check YAML indentation**
2. **Use IntelliSense** for corrections
3. **Validate against schema**

#### Authentication Issues
1. **Sign out and sign in** again
2. **Check GitHub permissions**
3. **Verify repository access**

### Quick Fixes
- **Restart VS Code** if extensions aren't loading
- **Check internet connection** for GitHub integration
- **Verify file permissions** for scripts
- **Update extensions** to latest versions

## 📚 Next Steps

### Learn More
1. **Read** `VSCODE_GITHUB_ACTIONS_GUIDE.md` for detailed features
2. **Explore** workflow templates in VS Code
3. **Customize** tasks and settings for your workflow

### Advanced Usage
1. **Set up debugging** for Next.js
2. **Configure** additional linters
3. **Add** custom tasks for your workflow
4. **Integrate** with other VS Code extensions

## ✅ Success Checklist

- [ ] GitHub Actions extension installed and working
- [ ] Workflows visible in VS Code sidebar
- [ ] Can edit workflow files with IntelliSense
- [ ] Can monitor workflow runs in real-time
- [ ] Can view detailed logs inline
- [ ] Can trigger workflows manually
- [ ] GitHub authentication working
- [ ] Tasks configured and accessible
- [ ] Secrets configured in GitHub
- [ ] Test pipeline executed successfully

## 🎉 You're Ready!

Your VS Code is now fully configured for GitHub Actions development. You can:

- ✅ Edit workflows with full IntelliSense
- ✅ Monitor CI/CD pipelines in real-time
- ✅ Debug issues directly in VS Code
- ✅ Manage deployments seamlessly
- ✅ Access all project tasks quickly

Happy coding! 🚀
