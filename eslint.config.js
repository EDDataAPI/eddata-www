const js = require('@eslint/js')

module.exports = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'coverage/**',
      '.cache/**',
      'public/**',
      '*.config.js',
      '__tests__/**',
      'jest.setup.js'
    ]
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        fetch: 'readonly',
        FormData: 'readonly',
        CustomEvent: 'readonly',
        IntersectionObserver: 'readonly',
        performance: 'readonly',
        URLSearchParams: 'readonly',
        URL: 'readonly',
        Response: 'readonly',
        Request: 'readonly',
        // Node.js globals
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        global: 'readonly',
        Buffer: 'readonly',
        // React/Next.js globals
        React: 'readonly',
        JSX: 'readonly'
      }
    },
    rules: {
      // Error prevention
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrors: 'none'
        }
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',

      // Code quality
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      curly: ['warn', 'all'],
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-constant-binary-expression': 'error',
      'no-dupe-else-if': 'error',

      // Optional - can be removed if too strict
      'object-shorthand': 'warn',
      'prefer-template': 'warn'
    }
  },
  // Specific overrides for logger.js and other utility files
  {
    files: ['lib/logger.js', 'scripts/**/*.js', 'pages/api/**/*.js'],
    rules: {
      'no-console': 'off'
    }
  },
  {
    // Legacy SFXR library exceptions
    files: ['lib/sfxr.js'],
    rules: {
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'object-shorthand': 'off',
      'prefer-template': 'off',
      'no-var': 'off',
      'no-redeclare': 'off',
      'no-prototype-builtins': 'off',
      eqeqeq: 'off',
      curly: 'off'
    }
  }
]
