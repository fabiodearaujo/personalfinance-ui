import { useState, useEffect } from 'react'

interface User {
  email: string
  user_id?: number
}

interface UseGetUserReturn {
  user: User | null
  isLoading: boolean
  error: string | null
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function useGetUser(): UseGetUserReturn {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('access_token')
        if (!token) {
          setError('No authentication token found')
          setIsLoading(false)
          return
        }

        const response = await fetch(`${API_BASE_URL}/users/my_user`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(
            errorData.detail || errorData.message || `Failed to fetch user with status ${response.status}`
          )
        }

        const userData = await response.json()
        setUser(userData)
        setError(null)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
        setError(errorMessage)
        console.error('Error fetching user:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  return { user, isLoading, error }
}
