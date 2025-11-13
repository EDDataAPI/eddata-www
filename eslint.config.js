const { FlatCompat } = require('@eslint/eslintrc')
const js = require('@eslint/js')

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended
})

module.exports = [
  js.configs.recommended,
  ...compat.extends('next/core-web-vitals'),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      // Error prevention
      'no-unused-vars': [
        'warn', // Downgrade to warning
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrors: 'none' // Don't warn about unused catch params
        }
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',

      // Code quality
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      curly: ['warn', 'all'], // Downgrade to warning
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-constant-binary-expression': 'error',
      'no-dupe-else-if': 'error',

      // React specific
      'react/display-name': 'off',
      'react/prop-types': 'off', // Using TypeScript for prop validation
      'react/react-in-jsx-scope': 'off', // Not needed in Next.js
      'react-hooks/exhaustive-deps': 'warn', // Downgrade to warning
      'react-hooks/rules-of-hooks': 'error',

      // Next.js specific
      '@next/next/no-img-element': 'warn', // Downgrade to warning
      'import/no-anonymous-default-export': 'off', // Allow for now

      // Optional - can be removed if too strict
      'object-shorthand': 'warn',
      'prefer-template': 'warn'
    }
  },
  // Specific overrides for logger.js and other utility files
  {
    files: ['lib/logger.js', 'scripts/**/*.js', 'pages/api/**/*.js'],
    rules: {
      'no-console': 'off' // Console is intentional in logger and scripts
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
