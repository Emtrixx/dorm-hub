import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import pluginCypress from 'eslint-plugin-cypress'
import globals from 'globals'

export default [
  {
    ignores: ['dist/**', 'node_modules/**']
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser
      }
    },
    rules: {
      // existing single-word page/component names (Home, Wiki, News, ...)
      'vue/multi-word-component-names': 'off'
    }
  },
  {
    files: ['tests/unit/**/*.spec.js'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        vi: 'readonly'
      }
    }
  },
  {
    files: ['tests/e2e/**/*.js'],
    ...pluginCypress.configs.recommended
  },
  {
    files: ['vite.config.mjs', 'eslint.config.mjs', 'cypress.config.js'],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  }
]
