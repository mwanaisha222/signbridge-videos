import React from 'react'
import { createRoot } from 'react-dom/client'
import { SignBridgeApp } from '@/components/SignBridgeApp'
import '../styles.css'

const container = document.getElementById('root')
if (!container) {
  throw new Error('Root container not found')
}

createRoot(container).render(
  <React.StrictMode>
    <SignBridgeApp />
  </React.StrictMode>,
)
