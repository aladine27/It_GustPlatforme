import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Pas d'alias pour @mui/styled-engine ici !
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
  ],
  optimizeDeps: {
    include: [
      '@mui/material',
      '@emotion/react',
      '@emotion/styled',
      '@mui/icons-material'
    ],
    exclude: [
      'primereact'
    ]
  },

})
