#!/usr/bin/env node

/**
 * Generate Secrets for GitHub Actions CI/CD Pipeline
 * This script helps generate secure secrets for your Eksetasi platform
 */

const crypto = require('crypto');

console.log('🔐 GitHub Actions Secrets Generator for Eksetasi\n');

// Generate secure random strings
function generateSecret(length = 64) {
    return crypto.randomBytes(length).toString('hex');
}

function generateJWTSecret() {
    return crypto.randomBytes(32).toString('base64');
}

// Generate all required secrets
const secrets = {
    'STAGING_JWT_SECRET': generateJWTSecret(),
    'PRODUCTION_JWT_SECRET': generateJWTSecret(),
};

console.log('📋 Copy these secrets to your GitHub repository:');
console.log('Go to: Settings → Secrets and variables → Actions\n');

console.log('🔑 JWT Secrets (Required):');
console.log('─'.repeat(50));
Object.entries(secrets).forEach(([key, value]) => {
    console.log(`${key}:`);
    console.log(`${value}\n`);
});

console.log('🗄️ Database URLs (Update with your actual database info):');
console.log('─'.repeat(50));
console.log('STAGING_DATABASE_URL:');
console.log('postgresql://username:password@host:5432/staging_db?schema=public\n');

console.log('PRODUCTION_DATABASE_URL:');
console.log('postgresql://username:password@host:5432/production_db?schema=public\n');

console.log('🌐 Vercel Configuration (Optional - if using Vercel):');
console.log('─'.repeat(50));
console.log('VERCEL_TOKEN:');
console.log('Get from: https://vercel.com/account/tokens\n');

console.log('VERCEL_ORG_ID:');
console.log('Get from: vercel whoami\n');

console.log('VERCEL_PROJECT_ID:');
console.log('Get from: .vercel/project.json after running "vercel link"\n');

console.log('🏥 Health Check URLs (Update with your actual domains):');
console.log('─'.repeat(50));
console.log('STAGING_URL:');
console.log('https://your-app-staging.vercel.app\n');

console.log('PRODUCTION_URL:');
console.log('https://your-app.vercel.app\n');

console.log('✅ Next Steps:');
console.log('1. Copy the secrets above to GitHub');
console.log('2. Update database URLs with your actual database info');
console.log('3. Set up Vercel (optional) and get the tokens');
console.log('4. Update health check URLs with your actual domains');
console.log('5. Follow the activate-cicd.md guide for complete setup');

console.log('\n🚀 Ready to activate your CI/CD pipeline!');
