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
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrors: 'all'
        }
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      
      // Code quality
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'always', { null: 'ignore' }],
      'curly': ['error', 'all'],
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-constant-binary-expression': 'error',
      'no-dupe-else-if': 'error',
      
      // React specific
      'react/display-name': 'off',
      'react/prop-types': 'off', // Using TypeScript for prop validation
      'react/react-in-jsx-scope': 'off', // Not needed in Next.js
      'react-hooks/exhaustive-deps': 'error',
      'react-hooks/rules-of-hooks': 'error',
      
      // Next.js specific
      '@next/next/no-img-element': 'error',
      'import/no-anonymous-default-export': 'warn',
      
      // Optional - can be removed if too strict
      'object-shorthand': 'warn',
      'prefer-template': 'warn'
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
      'eqeqeq': 'off',
      'curly': 'off'
    }
  }
]
