#!/usr/bin/env node

/**
 * EDData WWW Deployment Script
 * Manages Docker-based deployments for different environments
 * Based on eddata-collector deployment pattern
 */

const { execSync } = require('child_process')
const fs = require('fs')

const ENVIRONMENTS = {
  development: {
    compose: 'docker-compose.yml',
    env: '.env.development'
  },
  staging: {
    compose: 'docker-compose.staging.yml',
    env: '.env.staging'
  },
  production: {
    compose: 'docker-compose.production.yml',
    env: '.env.production'
  }
}

class DeploymentManager {
  constructor() {
    this.environment = process.env.NODE_ENV || 'development'
    this.verbose = process.argv.includes('--verbose')
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString()
    const prefix = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : '✅'
    console.log(`${prefix} [${timestamp}] ${message}`)
  }

  exec(command, options = {}) {
    if (this.verbose) {
      this.log(`Executing: ${command}`)
    }
    
    try {
      const result = execSync(command, {
        encoding: 'utf8',
        stdio: this.verbose ? 'inherit' : 'pipe',
        ...options
      })
      return result
    } catch (error) {
      this.log(`Command failed: ${command}`, 'error')
      this.log(error.message, 'error')
      throw error
    }
  }

  checkPrerequisites() {
    this.log('Checking prerequisites...')
    
    try {
      this.exec('docker --version')
      this.exec('docker-compose --version')
    } catch (error) {
      throw new Error('Docker and Docker Compose are required')
    }

    const config = ENVIRONMENTS[this.environment]
    if (!fs.existsSync(config.compose)) {
      throw new Error(`Compose file not found: ${config.compose}`)
    }

    this.log('Prerequisites check passed')
  }

  loadEnvironment() {
    const config = ENVIRONMENTS[this.environment]
    if (fs.existsSync(config.env)) {
      this.log(`Loading environment from ${config.env}`)
      require('dotenv').config({ path: config.env })
    } else {
      this.log(`Environment file ${config.env} not found, using defaults`, 'warn')
    }
  }

  build() {
    this.log(`Building Docker image for ${this.environment}...`)
    const config = ENVIRONMENTS[this.environment]
    
    this.exec(`docker-compose -f ${config.compose} build --no-cache`)
    this.log('Build completed successfully')
  }

  deploy() {
    this.log(`Deploying to ${this.environment}...`)
    const config = ENVIRONMENTS[this.environment]
    
    // Stop existing containers
    try {
      this.exec(`docker-compose -f ${config.compose} down`)
    } catch (error) {
      this.log('No existing containers to stop', 'warn')
    }
    
    // Start new containers
    this.exec(`docker-compose -f ${config.compose} up -d`)
    
    this.log('Deployment completed')
    this.log('Waiting for service to be ready...')
    
    // Wait for health check
    this.waitForHealthy()
  }

  waitForHealthy(maxWait = 120) {
    const startTime = Date.now()
    const maxWaitMs = maxWait * 1000
    
    while (Date.now() - startTime < maxWaitMs) {
      try {
        const result = this.exec('docker ps --filter "name=eddata-www" --filter "health=healthy" --format "{{.ID}}"')
        if (result.trim()) {
          this.log('Service is healthy!')
          return
        }
      } catch (error) {
        // Continue waiting
      }
      
      // Wait 2 seconds before next check
      execSync('sleep 2')
    }
    
    this.log('Service did not become healthy in time', 'warn')
  }

  rollback() {
    this.log('Rolling back to previous version...')
    const config = ENVIRONMENTS[this.environment]
    
    this.exec(`docker-compose -f ${config.compose} down`)
    this.exec(`docker-compose -f ${config.compose} up -d --force-recreate`)
    
    this.log('Rollback completed')
  }

  status() {
    this.log('Checking service status...')
    const config = ENVIRONMENTS[this.environment]
    
    try {
      this.exec(`docker-compose -f ${config.compose} ps`)
    } catch (error) {
      this.log('Failed to get status', 'error')
    }
  }

  logs() {
    this.log('Fetching logs...')
    const config = ENVIRONMENTS[this.environment]
    
    this.exec(`docker-compose -f ${config.compose} logs -f --tail=100`)
  }

  showHelp() {
    console.log(`
EDData WWW Deployment Manager

Usage:
  node scripts/deploy.js <command> [options]

Commands:
  build       Build Docker image
  deploy      Deploy to environment
  status      Show service status
  logs        Show service logs
  rollback    Rollback to previous version
  help        Show this help

Options:
  --env=<env>    Environment (development|staging|production)
  --verbose      Show detailed output

Examples:
  node scripts/deploy.js build --env=production
  node scripts/deploy.js deploy --env=staging
  node scripts/deploy.js logs --verbose
    `)
  }
}

// Main execution
async function main() {
  const command = process.argv[2] || 'help'
  const manager = new DeploymentManager()

  // Override environment from --env parameter
  const envArg = process.argv.find(arg => arg.startsWith('--env='))
  if (envArg) {
    manager.environment = envArg.split('=')[1]
  }

  try {
    switch (command) {
      case 'build':
        manager.checkPrerequisites()
        manager.loadEnvironment()
        manager.build()
        break
        
      case 'deploy':
        manager.checkPrerequisites()
        manager.loadEnvironment()
        manager.build()
        manager.deploy()
        break
        
      case 'status':
        manager.status()
        break
        
      case 'logs':
        manager.logs()
        break
        
      case 'rollback':
        manager.rollback()
        break
        
      default:
        manager.showHelp()
        break
    }
  } catch (error) {
    manager.log(error.message, 'error')
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

module.exports = DeploymentManager
