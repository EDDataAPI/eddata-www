# Contributing to EDData WWW

Thank you for your interest in contributing to EDData WWW! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Environment details** (OS, Node.js version, browser)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **List any similar features** in other applications

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting
5. Commit your changes (see commit message guidelines below)
6. Push to your fork
7. Open a Pull Request

## Development Setup

### Prerequisites

- **Node.js** >= 20.0.0
- **npm** >= 10.0.0

### Getting Started

\`\`\`bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/eddata-www.git
cd eddata-www

# Install dependencies
npm install

# Start development server
npm run dev

# Run in development mode with local API
npm run dev:local
\`\`\`

### Project Structure

\`\`\`
eddata-www/
├── app/              # Next.js 15 app directory
├── components/       # React components
├── css/             # Stylesheets
├── lib/             # Utility libraries
│   ├── consts.js    # Configuration constants
│   ├── logger.js    # Logging utilities
│   ├── health.js    # Health check endpoints
│   └── utils/       # Helper functions
├── pages/           # Next.js pages
└── public/          # Static assets
\`\`\`

## Pull Request Process

1. **Update documentation** - Document any new features or changes
2. **Add tests** - Ensure new functionality is tested
3. **Follow coding standards** - Run linting and formatting
4. **Keep commits atomic** - One logical change per commit
5. **Write good commit messages** - Follow conventional commits

### Commit Message Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/):

\`\`\`
<type>(<scope>): <description>

[optional body]

[optional footer]
\`\`\`

**Types:**
- \`feat\`: New feature
- \`fix\`: Bug fix
- \`docs\`: Documentation changes
- \`style\`: Code style changes (formatting, etc.)
- \`refactor\`: Code refactoring
- \`perf\`: Performance improvements
- \`test\`: Adding or updating tests
- \`chore\`: Maintenance tasks

**Examples:**
\`\`\`
feat(commodity): add export filtering by distance
fix(system): resolve undefined coordinates issue
docs(readme): update installation instructions
refactor(lib): improve error handling in notification module
\`\`\`

## Coding Standards

### JavaScript/TypeScript

- **Use ESLint** - Run \`npm run lint\` before committing
- **Use Prettier** - Run \`npm run format\` for consistent formatting
- **Prefer const** over let, avoid var
- **Use descriptive variable names**
- **Add JSDoc comments** for public functions
- **Handle errors properly** - Use try/catch and error boundaries

### Code Style

\`\`\`javascript
// Good
function getCommodityByName(name) {
  if (!name) {
    throw new ValidationError('Commodity name is required')
  }
  
  return commodities.find(c => 
    c.name.toLowerCase() === name.toLowerCase()
  )
}

// Avoid
function getcomm(n) {
  return commodities.filter(x => x.name == n)[0]
}
\`\`\`

### React Components

- **Use functional components** with hooks
- **Keep components focused** - Single responsibility
- **Extract reusable logic** into custom hooks
- **Memoize expensive computations** with \`useMemo\`
- **Optimize re-renders** with \`useCallback\` and \`React.memo\`

## Testing Guidelines

### Running Tests

\`\`\`bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
\`\`\`

### Writing Tests

- **Test user behavior** not implementation details
- **Use meaningful test descriptions**
- **Follow AAA pattern** - Arrange, Act, Assert
- **Mock external dependencies** (API calls, etc.)

\`\`\`javascript
describe('CommodityFilter', () => {
  it('should filter commodities by name', () => {
    // Arrange
    const commodities = [/* ... */]
    
    // Act
    const filtered = filterByName(commodities, 'Gold')
    
    // Assert
    expect(filtered).toHaveLength(1)
    expect(filtered[0].name).toBe('Gold')
  })
})
\`\`\`

## Code Review Process

All submissions require review. We use GitHub pull requests for this purpose.

**Reviewers will check:**
- Code quality and style
- Test coverage
- Documentation
- Performance implications
- Security considerations

## Getting Help

- **Discord** - Join our community server
- **GitHub Issues** - For bugs and feature requests
- **GitHub Discussions** - For questions and general discussion

## Recognition

Contributors will be added to the [AUTHORS.md](AUTHORS.md) file.

Thank you for contributing! 🚀
