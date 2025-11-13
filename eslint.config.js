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
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      'no-console': 'off', // Allow console statements in this project
      'prefer-const': 'warn',
      'no-var': 'warn',
      'object-shorthand': 'off',
      'prefer-template': 'off',
      'react/display-name': 'off', // Allow anonymous components
      'import/no-anonymous-default-export': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'no-empty': 'warn',
      '@next/next/no-img-element': 'warn',
      'no-constant-binary-expression': 'warn',
      'no-dupe-else-if': 'warn'
    }
  },
  {
    files: ['lib/sfxr.js'],
    rules: {
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'object-shorthand': 'off',
      'prefer-template': 'off',
      'no-var': 'off',
      'no-redeclare': 'off',
      'no-prototype-builtins': 'off'
    }
  }
]
