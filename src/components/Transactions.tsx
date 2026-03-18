import { useGetTransactions } from '../hooks/useGetTransactions'
import './Transactions.css'

export interface TransactionsProps {
  balance: number
  onBack: () => void
}

export function Transactions({ balance, onBack }: TransactionsProps) {
  const { transactions, isLoading, error } = useGetTransactions()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return dateString
    }
  }

  const getTransactionType = (transaction: any) => {
    const type = transaction.transaction_type || transaction.type || 'unknown'
    return type.toLowerCase()
  }

  const getTransactionValue = (transaction: any) => {
    return transaction.transaction_value ?? transaction.value ?? 0
  }

  const getTransactionCategory = (transaction: any) => {
    return transaction.transaction_category || transaction.category || 'N/A'
  }

  const getTransactionName = (transaction: any) => {
    return transaction.transaction_name || transaction.name || 'Transaction'
  }

  return (
    <div className="transactions">
      <div className="transactions-header">
        <div className="transactions-header-content">
          <div>
            <h1>Main Account Transactions</h1>
            <p>View all your transaction history</p>
          </div>
          <button className="transactions-back-button" onClick={onBack}>
            ← Back to Dashboard
          </button>
        </div>
      </div>

      <div className="transactions-main">
        <div className="transactions-balance-card">
          <h2>Account Balance</h2>
          <div className="transactions-balance-display">
            <span className="balance-label">Main Account:</span>
            <span className="balance-amount-large">{formatCurrency(balance)}</span>
          </div>
        </div>

        <div className="transactions-list-card">
          <h2>Transactions</h2>

          {isLoading && <div className="transactions-loading">Loading transactions...</div>}

          {error && <div className="transactions-error">Error: {error}</div>}

          {!isLoading && !error && transactions.length === 0 && (
            <div className="transactions-empty">
              <p>No transactions found for this account.</p>
            </div>
          )}

          {!isLoading && !error && transactions.length > 0 && (
            <div className="transactions-table-container">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => {
                    const type = getTransactionType(transaction)
                    const value = getTransactionValue(transaction)
                    const isIncome = type === 'income' || type === 'deposit'

                    return (
                      <tr key={transaction.transaction_id || transaction.id || index}>
                        <td>{formatDate(transaction.transaction_date || transaction.date)}</td>
                        <td>{getTransactionName(transaction)}</td>
                        <td>{getTransactionCategory(transaction)}</td>
                        <td>
                          <span className={`transaction-type-badge ${isIncome ? 'income' : 'expense'}`}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </span>
                        </td>
                        <td className={`transaction-value ${isIncome ? 'income' : 'expense'}`}>
                          {isIncome ? '+' : '-'} {formatCurrency(Math.abs(value))}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
