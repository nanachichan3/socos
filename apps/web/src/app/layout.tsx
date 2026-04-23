import type { Metadata } from 'next'
import './globals.css'
import { PostHogProvider } from '@posthog/react-server'

// PostHog server-side initialization
function PostHogInit() {
  const posthogApiKey = process.env.POSTHOG_API_KEY
  const posthogHost = process.env.POSTHOG_HOST || 'https://app.posthog.com'

  if (posthogApiKey) {
    return (
      <PostHogProvider
        apiKey={posthogApiKey}
        apiHost={posthogHost}
        person_profiles="identified_only"
      >
        {/* Child components will consume PostHog context */}
      </PostHogProvider>
    )
  }
  return null
}

export const metadata: Metadata = {
  title: 'SOCOS - Your Relationships, Leveled Up',
  description: 'The gamified personal CRM that turns networking into a game. Track contacts, log interactions, and never miss important moments.',
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔗</text></svg>",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="dark bg-[#0b1326] text-[#dae2fd]">
        <PostHogInit />
        {children}
      </body>
    </html>
  )
}
