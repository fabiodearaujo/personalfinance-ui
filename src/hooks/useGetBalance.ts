import { useState, useEffect } from 'react'

interface BalanceData {
  balance?: number
  [key: string]: any
}

interface UseGetBalanceReturn {
  balance: number | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function useGetBalance(accountType?: string): UseGetBalanceReturn {
  const [balance, setBalance] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        setError('No authentication token found')
        setIsLoading(false)
        return
      }

      let url = `${API_BASE_URL}/transactions/balance`
      if (accountType) {
        url += `?account_type=${encodeURIComponent(accountType)}`
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          errorData.detail || errorData.message || `Failed to fetch balance with status ${response.status}`
        )
      }

      const balanceData: BalanceData = await response.json()
      // Try to extract balance from response - adjust based on actual API response format
      const balanceAmount = balanceData.balance !== undefined ? balanceData.balance : 0
      setBalance(balanceAmount)
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
      console.error('Error fetching balance:', err)
      setBalance(0)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBalance()
  }, [accountType])

  const refetch = async () => {
    setIsLoading(true)
    await fetchBalance()
  }

  return { balance, isLoading, error, refetch }
}
