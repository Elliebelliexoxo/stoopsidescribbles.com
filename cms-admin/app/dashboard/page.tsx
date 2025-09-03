'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">CMS Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {session.user?.name}</span>
              <button
                onClick={() => signOut()}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Stoopside Scribbles Content Management</h2>
            <p className="text-gray-600 mb-6">
              Welcome to your CMS dashboard. From here you can manage content for stoopsidescribbles.com
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Posts</h3>
                <p className="text-gray-600 mb-4">Manage blog posts and articles</p>
                <button className="text-indigo-600 hover:text-indigo-500">
                  Manage Posts →
                </button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Pages</h3>
                <p className="text-gray-600 mb-4">Edit static pages content</p>
                <button className="text-indigo-600 hover:text-indigo-500">
                  Manage Pages →
                </button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Media</h3>
                <p className="text-gray-600 mb-4">Upload and manage images</p>
                <button className="text-indigo-600 hover:text-indigo-500">
                  Manage Media →
                </button>
              </div>
            </div>

            <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-yellow-800 mb-2">Next Steps:</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Connect to a database for persistent content storage</li>
                <li>• Set up GitHub integration for content deployment</li>
                <li>• Configure Vercel environment variables</li>
                <li>• Implement content editing interfaces</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}