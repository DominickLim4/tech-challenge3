import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import reactPlugin from 'eslint-plugin-react'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'node_modules', 'coverage']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      react: reactPlugin,
    },
    languageOptions: {
      ecmaVersion: 2024,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'no-console': 'error',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^[A-Z_]' }],
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'warn',
    },
  },
  {
    files: ['**/*.test.{js,jsx}', '**/setupTests.js'],
    rules: {
      'no-console': 'off',
    },
  },
])
