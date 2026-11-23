import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // `dist` é artefato de build; `.claude` é o kit de ferramentas pessoal
  // (gerado pelo kit-mcp, roda em Node/CommonJS e não faz parte do app).
  globalIgnores(['dist', '.claude']),
  {
    // Código do app: roda no navegador.
    files: ['src/**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    // Arquivos de configuração: rodam no Node (process, etc.).
    files: ['*.config.js'],
    languageOptions: { globals: globals.node },
  },
])
