import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Welcome to TanStack Start</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300">
        This is a starter template featuring SSR, RPC (Server Functions), and TanStack Query.
      </p>
    </div>
  )
}