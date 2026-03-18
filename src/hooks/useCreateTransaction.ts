import { useState } from 'react'

export interface CreateTransactionPayload {
  user_id: number
  transaction_name: string
  transaction_category: string
  transaction_type: string
  transaction_value: number
  transaction_date: string
  account_type: string
}

interface UseCreateTransactionReturn {
  isLoading: boolean
  message: string
  handleCreateTransaction: (payload: CreateTransactionPayload) => Promise<void>
  clearMessage: () => void
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function useCreateTransaction(
  onSuccess?: () => void,
  onError?: () => void
): UseCreateTransactionReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleCreateTransaction = async (payload: CreateTransactionPayload) => {
    setIsLoading(true)
    setMessage('')

    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(`${API_BASE_URL}/transactions/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        let errorMessage = `Failed to create transaction with status ${response.status}`

        if (errorData.detail) {
          if (typeof errorData.detail === 'string') {
            errorMessage = errorData.detail
          } else if (Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail.map((err: any) => err.msg || err).join(', ')
          }
        }

        throw new Error(errorMessage)
      }

      setMessage('Transaction created successfully!')
      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setMessage(errorMessage)
      console.error('Error creating transaction:', err)
      if (onError) {
        onError()
      }
    } finally {
      setIsLoading(false)
    }
  }

  const clearMessage = () => {
    setMessage('')
  }

  return { isLoading, message, handleCreateTransaction, clearMessage }
}
