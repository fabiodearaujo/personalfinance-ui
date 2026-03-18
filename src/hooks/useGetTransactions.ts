import { useState, useEffect } from 'react'

export interface Transaction {
  id?: number
  transaction_id?: number
  transaction_name?: string
  transaction_category?: string
  transaction_type?: string
  transaction_value?: number
  transaction_date?: string
  account_type?: string
  [key: string]: any
}

interface UseGetTransactionsReturn {
  transactions: Transaction[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function useGetTransactions(): UseGetTransactionsReturn {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        setError('No authentication token found')
        setIsLoading(false)
        return
      }

      const response = await fetch(`${API_BASE_URL}/transactions/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          errorData.detail || errorData.message || `Failed to fetch transactions with status ${response.status}`
        )
      }

      const transactionsData = await response.json()
      // Handle if response is an array or an object with array data
      const transactionsList = Array.isArray(transactionsData)
        ? transactionsData
        : transactionsData.transactions || transactionsData.data || []
      
      setTransactions(transactionsList)
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
      console.error('Error fetching transactions:', err)
      setTransactions([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const refetch = async () => {
    setIsLoading(true)
    await fetchTransactions()
  }

  return { transactions, isLoading, error, refetch }
}
