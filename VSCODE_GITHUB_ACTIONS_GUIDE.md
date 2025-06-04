# 🔧 VS Code GitHub Actions Extension Guide

This guide shows you how to use the GitHub Actions extension in VS Code to manage your Eksetasi CI/CD pipeline effectively.

## 📦 Installation & Setup

### Step 1: Install GitHub Actions Extension

1. **Open VS Code**
2. **Go to Extensions** (Ctrl+Shift+X / Cmd+Shift+X)
3. **Search for "GitHub Actions"**
4. **Install the official extension** by GitHub

### Step 2: Authenticate with GitHub

1. **Open Command Palette** (Ctrl+Shift+P / Cmd+Shift+P)
2. **Type**: `GitHub Actions: Sign in to GitHub`
3. **Follow the authentication flow**
4. **Grant necessary permissions**

## 🎯 Key Features & Usage

### 1. **Workflow Management**

#### View Workflows
- **Open GitHub Actions panel** in the sidebar
- **See all workflows** in your repository
- **View workflow status** (success, failure, running)

#### Edit Workflows
- **Navigate to** `.github/workflows/`
- **Open workflow files** (ci.yml, cd.yml)
- **Get syntax highlighting** and IntelliSense
- **Validate YAML syntax** automatically

### 2. **Workflow Runs**

#### Monitor Runs
- **View recent runs** in the GitHub Actions panel
- **See run status** and duration
- **Filter by workflow** or branch

#### View Logs
- **Click on a workflow run**
- **Expand job steps**
- **View detailed logs** inline
- **Download logs** if needed

### 3. **Workflow Triggers**

#### Manual Triggers
- **Right-click on workflow**
- **Select "Run workflow"**
- **Choose branch** and parameters
- **Monitor execution** in real-time

#### Re-run Failed Jobs
- **Click on failed run**
- **Select "Re-run jobs"**
- **Choose specific jobs** to re-run

## 🛠️ Practical Usage for Eksetasi

### Managing CI Pipeline

1. **Open `.github/workflows/ci.yml`**
2. **Edit workflow steps** with IntelliSense
3. **Validate syntax** automatically
4. **Commit and push** changes
5. **Monitor execution** in VS Code

### Managing CD Pipeline

1. **Open `.github/workflows/cd.yml`**
2. **Update deployment settings**
3. **Test changes** with manual triggers
4. **Monitor deployments** in real-time

### Debugging Workflows

1. **View failed runs** in the panel
2. **Expand failed steps**
3. **Read error messages** inline
4. **Fix issues** and re-run

## 📋 VS Code Workspace Configuration

### Recommended Settings

Create `.vscode/settings.json`:

```json
{
  "yaml.schemas": {
    "https://json.schemastore.org/github-workflow.json": ".github/workflows/*.yml"
  },
  "yaml.validate": true,
  "yaml.completion": true,
  "files.associations": {
    "*.yml": "yaml",
    "*.yaml": "yaml"
  },
  "editor.quickSuggestions": {
    "strings": true
  }
}
```

### Recommended Extensions

Add to `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "github.vscode-github-actions",
    "redhat.vscode-yaml",
    "ms-vscode.vscode-json",
    "github.vscode-pull-request-github"
  ]
}
```

## 🚀 Workflow Development Tips

### 1. **Use Workflow Templates**
- **Command Palette**: `GitHub Actions: Create workflow`
- **Choose from templates**
- **Customize for your needs**

### 2. **Validate Before Commit**
- **Use YAML validation**
- **Check syntax highlighting**
- **Test with manual triggers**

### 3. **Monitor in Real-time**
- **Keep GitHub Actions panel open**
- **Watch runs as they execute**
- **Get immediate feedback**

### 4. **Debug Efficiently**
- **Use step-by-step logs**
- **Add debug outputs**
- **Test locally when possible**

## 📊 Monitoring Your Eksetasi Pipeline

### CI Pipeline Monitoring

1. **Watch for PR checks**
   - Linting status
   - TypeScript compilation
   - Security audit results
   - Database migration tests

2. **Review build artifacts**
   - Build success/failure
   - Bundle size changes
   - Performance metrics

### CD Pipeline Monitoring

1. **Staging Deployments**
   - Automatic deployment status
   - Health check results
   - Application accessibility

2. **Production Deployments**
   - Approval workflow
   - Database migration status
   - Health verification

## 🔧 Troubleshooting with VS Code

### Common Issues

#### 1. **Workflow Syntax Errors**
- **Red squiggly lines** indicate syntax errors
- **Hover for details**
- **Use auto-completion** to fix

#### 2. **Authentication Issues**
- **Re-authenticate**: Command Palette → `GitHub Actions: Sign in`
- **Check permissions** in GitHub settings
- **Verify repository access**

#### 3. **Workflow Not Triggering**
- **Check trigger conditions** in workflow file
- **Verify branch names** and paths
- **Test with manual trigger**

### Debugging Steps

1. **Check workflow file syntax**
2. **Verify secrets configuration**
3. **Test individual steps locally**
4. **Use workflow dispatch for testing**
5. **Review GitHub Actions logs**

## 📈 Advanced Features

### 1. **Workflow Dispatch**
```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy'
        required: true
        default: 'staging'
        type: choice
        options:
        - staging
        - production
```

### 2. **Matrix Builds**
```yaml
strategy:
  matrix:
    node-version: [18, 20]
    os: [ubuntu-latest, windows-latest]
```

### 3. **Conditional Steps**
```yaml
- name: Deploy to production
  if: startsWith(github.ref, 'refs/tags/v')
  run: npm run deploy:prod
```

## 🎯 Best Practices

### 1. **Workflow Organization**
- Keep workflows focused and single-purpose
- Use descriptive names for jobs and steps
- Comment complex logic

### 2. **Secret Management**
- Use GitHub Secrets for sensitive data
- Never commit secrets to repository
- Rotate secrets regularly

### 3. **Performance Optimization**
- Cache dependencies when possible
- Use parallel jobs
- Minimize workflow run time

### 4. **Error Handling**
- Add proper error messages
- Use continue-on-error when appropriate
- Implement retry logic for flaky tests

## 📚 Additional Resources

### VS Code Commands
- `GitHub Actions: Open workflow file`
- `GitHub Actions: View workflow runs`
- `GitHub Actions: Run workflow`
- `GitHub Actions: Cancel workflow run`

### Keyboard Shortcuts
- **Ctrl+Shift+P**: Command Palette
- **Ctrl+`**: Open Terminal
- **Ctrl+Shift+E**: Explorer Panel
- **Ctrl+Shift+G**: Source Control

### Documentation Links
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [VS Code GitHub Actions Extension](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-github-actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)

---

This guide helps you leverage VS Code's GitHub Actions extension to efficiently manage your Eksetasi CI/CD pipeline directly from your editor.
