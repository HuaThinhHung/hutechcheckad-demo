// @mantine styles
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/dropzone/styles.css'
import '@mantine/code-highlight/styles.css'
import '@mantine/tiptap/styles.css'

import React from 'react'
import ReactDOM from 'react-dom/client'

import App from '@/App'
import { ReduxProvider } from '@/redux'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ReduxProvider>
    <App />
  </ReduxProvider>
)
