import { useState } from 'react'

export interface SignUpFormData {
  email: string
  password: string
}

export interface SignUpMessage {
  type: 'success' | 'error'
  text: string
}

interface UseSignUpReturn {
  isLoading: boolean
  message: SignUpMessage | null
  handleSignUpSubmit: (data: SignUpFormData) => Promise<void>
  clearMessage: () => void
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function useSignUp(
  onSuccess?: () => void,
  onError?: () => void
): UseSignUpReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<SignUpMessage | null>(null)

  const handleSignUpSubmit = async (data: SignUpFormData) => {
    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch(`${API_BASE_URL}/users/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          errorData.message || `Sign up failed with status ${response.status}`
        )
      }

      const responseData = await response.json()

      setMessage({
        type: 'success',
        text: 'Account created successfully! Redirecting to login...',
      })

      console.log('Sign up successful:', responseData)

      // Call success callback after 2 seconds
      setTimeout(() => {
        setMessage(null)
        if (onSuccess) {
          onSuccess()
        }
      }, 2000)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred'

      setMessage({
        type: 'error',
        text: errorMessage,
      })

      console.error('Sign up error:', error)

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
    handleSignUpSubmit,
    clearMessage,
  }
}
