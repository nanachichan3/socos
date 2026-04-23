import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// PostHog initialization
const posthogApiKey = import.meta.env.VITE_POSTHOG_API_KEY
if (posthogApiKey) {
  import('posthog-js').then(({ default: posthog }) => {
    posthog.init(posthogApiKey, {
      api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com',
      person_profiles: 'identified_only',
    })
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
