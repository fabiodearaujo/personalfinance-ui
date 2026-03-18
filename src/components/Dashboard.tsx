import { useState } from 'react'
import { useGetUser } from '../hooks/useGetUser'
import { useGetBalance } from '../hooks/useGetBalance'
import { useCreateTransaction } from '../hooks/useCreateTransaction'
import type { CreateTransactionPayload } from '../hooks/useCreateTransaction'
import { CreateTransactionModal } from './CreateTransactionModal'
import './Dashboard.css'

interface DashboardProps {
  onLogout?: () => void
  onViewTransactions?: (balance: number) => void
}

export function Dashboard({ onLogout, onViewTransactions }: DashboardProps) {
  const [showAddTransactionModal, setShowAddTransactionModal] = useState(false)
  const { user, isLoading: userLoading } = useGetUser()
  const { balance: mainBalance, isLoading: mainBalanceLoading } = useGetBalance(
    'main'
  )
  const { balance: savingsBalance, isLoading: savingsBalanceLoading } =
    useGetBalance('savings')

  const {
    isLoading: isCreateTransactionLoading,
    message: createTransactionMessage,
    handleCreateTransaction,
    clearMessage: clearCreateTransactionMessage,
  } = useCreateTransaction(
    // onSuccess callback
    () => {
      // Close modal after success
      setTimeout(() => {
        setShowAddTransactionModal(false)
        clearCreateTransactionMessage()
      }, 2000)
    },
    // onError callback
    undefined
  )

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('token_type')
    if (onLogout) {
      onLogout()
    }
  }

  const handleCloseAddTransactionModal = () => {
    setShowAddTransactionModal(false)
    clearCreateTransactionMessage()
  }

  const handleAddTransactionSubmit = async (payload: CreateTransactionPayload) => {
    return handleCreateTransaction(payload)
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div>
            <h1>💰 Personal Finance App</h1>
            <p>Dashboard</p>
          </div>
          <button className="dashboard-logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-welcome-card">
          <h2>Welcome to Your Dashboard</h2>
          <p>This is a placeholder dashboard. More features coming soon!</p>

          <div className="dashboard-welcome-section">
            <h2>Welcome back!</h2>
            <p className="user-email">
              {userLoading ? 'Loading...' : user?.email || 'User'}
            </p>
          </div>

          <div className="dashboard-accounts-grid">
            {/* Main Account Card */}
            <div className="account-card main-account">
              <h3>💳 Main Account</h3>
              {mainBalanceLoading ? (
                <p className="account-card-loading">Loading balance...</p>
              ) : (
                <>
                  <p className="balance-label">Current Balance</p>
                  <div className="balance-amount">
                    ${(mainBalance || 0).toFixed(2)}
                  </div>
                  <button
                    className="account-button"
                    onClick={() => onViewTransactions?.(mainBalance || 0)}
                  >
                    View Transactions
                  </button>
                </>
              )}
            </div>

            {/* Savings Account Card */}
            <div className="account-card savings-account">
              <h3>🏦 Savings Account</h3>
              {savingsBalanceLoading ? (
                <p className="account-card-loading">Loading balance...</p>
              ) : (
                <>
                  <p className="balance-label">Current Balance</p>
                  <div className="balance-amount">
                    ${(savingsBalance || 0).toFixed(2)}
                  </div>
                  <button
                    className="account-button"
                    onClick={() => onViewTransactions?.(savingsBalance || 0)}
                  >
                    View Transactions
                  </button>
                </>
              )}
            </div>

            {/* Add Transaction Card */}
            <div
              className="add-transaction-card"
              onClick={() => setShowAddTransactionModal(true)}
            >
              <div className="add-transaction-icon">➕</div>
              <h3 className="add-transaction-title">Add Transaction</h3>
              <p className="add-transaction-description">
                Record a new expense or income
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Add Transaction Modal */}
      <CreateTransactionModal
        isOpen={showAddTransactionModal}
        onClose={handleCloseAddTransactionModal}
        onSubmit={handleAddTransactionSubmit}
        isLoading={isCreateTransactionLoading}
        message={createTransactionMessage}
        userId={user?.user_id || 0}
      />
    </div>
  )
}
