import { useState } from 'react'

export interface LoginFormData {
  username: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
}

export interface LoginMessage {
  type: 'success' | 'error'
  text: string
}

interface UseLoginReturn {
  isLoading: boolean
  message: LoginMessage | null
  handleLoginSubmit: (data: LoginFormData) => Promise<void>
  clearMessage: () => void
  token: string | null
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function useLogin(
  onSuccess?: () => void,
  onError?: () => void
): UseLoginReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<LoginMessage | null>(null)
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('access_token')
  )

  const handleLoginSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setMessage(null)

    try {
      // Create form data for OAuth2 password flow
      const formData = new URLSearchParams()
      formData.append('username', data.username)
      formData.append('password', data.password)

      const response = await fetch(`${API_BASE_URL}/auth/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        
        // Handle different error response formats
        let errorMessage = `Login failed with status ${response.status}`
        
        if (errorData.detail) {
          if (typeof errorData.detail === 'string') {
            errorMessage = errorData.detail
          } else if (Array.isArray(errorData.detail)) {
            // If detail is an array of validation errors
            errorMessage = errorData.detail
              .map((err: any) => err.msg || JSON.stringify(err))
              .join(', ')
          }
        } else if (errorData.message) {
          errorMessage = errorData.message
        }
        
        throw new Error(errorMessage)
      }

      const responseData: LoginResponse = await response.json()

      // Store token in localStorage
      localStorage.setItem('access_token', responseData.access_token)
      localStorage.setItem('token_type', responseData.token_type)
      setToken(responseData.access_token)

      setMessage({
        type: 'success',
        text: 'Login successful! Redirecting...',
      })

      console.log('Login successful')

      // Call success callback after 1.5 seconds
      setTimeout(() => {
        setMessage(null)
        if (onSuccess) {
          onSuccess()
        }
      }, 1500)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred'

      setMessage({
        type: 'error',
        text: errorMessage,
      })

      console.error('Login error:', error)

      if (onError) {
        onError()
      }
    } finally {
      setIsLoading(false)
    }
  }

  const clearMessage = () => {
    setMessage(null)
  }

  return {
    isLoading,
    message,
    handleLoginSubmit,
    clearMessage,
    token,
  }
}
