import { getSharedMessage } from '@ts-monorepo-boilerplate/common';

function App() {
  const sharedMessage = getSharedMessage();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="flex flex-col items-center gap-8">
        <img 
          src="/logo.gif" 
          alt="Logo" 
          className="w-64 h-64 object-contain"
        />
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Welcome to ts-monorepo-boilerplate</h1>
          <p className="text-lg text-muted-foreground">{sharedMessage}</p>
        </div>
      </div>
    </main>
  )
}

export default App
