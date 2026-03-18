import { useState } from 'react'
import type { CreateTransactionPayload } from '../hooks/useCreateTransaction'

interface CreateTransactionFormProps {
  userId: number
  onSubmit: (payload: CreateTransactionPayload) => Promise<void>
  isLoading: boolean
}

interface FormData {
  transaction_name: string
  transaction_category: string
  transaction_type: string
  transaction_value: string
  transaction_date: string
  account_type: string
}

const TRANSACTION_TYPES = ['expense', 'income', 'deposit', 'withdrawal']
const CATEGORIES = [
  'Groceries',
  'Transportation',
  'Utilities',
  'Entertainment',
  'Dining',
  'Shopping',
  'Healthcare',
  'Education',
  'Salary',
  'Investment',
  'Refund',
  'Other',
]
const ACCOUNT_TYPES = ['main', 'savings']

export function CreateTransactionForm({ userId, onSubmit, isLoading }: CreateTransactionFormProps) {
  const [formData, setFormData] = useState<FormData>({
    transaction_name: '',
    transaction_category: 'Other',
    transaction_type: 'expense',
    transaction_value: '',
    transaction_date: new Date().toISOString().split('T')[0],
    account_type: 'main',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.transaction_name.trim()) {
      newErrors.transaction_name = 'Transaction name is required'
    }

    if (!formData.transaction_value || parseFloat(formData.transaction_value) <= 0) {
      newErrors.transaction_value = 'Amount must be greater than 0'
    }

    if (!formData.transaction_date) {
      newErrors.transaction_date = 'Date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const payload: CreateTransactionPayload = {
      user_id: userId,
      transaction_name: formData.transaction_name,
      transaction_category: formData.transaction_category,
      transaction_type: formData.transaction_type,
      transaction_value: parseFloat(formData.transaction_value),
      transaction_date: formData.transaction_date,
      account_type: formData.account_type,
    }

    try {
      await onSubmit(payload)
      // Reset form on success
      setFormData({
        transaction_name: '',
        transaction_category: 'Other',
        transaction_type: 'expense',
        transaction_value: '',
        transaction_date: new Date().toISOString().split('T')[0],
        account_type: 'main',
      })
    } catch (err) {
      // Error is handled by the hook
      console.error('Form submission error:', err)
    }
  }

  return (
    <form className="create-transaction-form" onSubmit={handleSubmit}>
      {/* Transaction Name */}
      <div className="form-group">
        <label htmlFor="transaction_name">Transaction Name *</label>
        <input
          type="text"
          id="transaction_name"
          name="transaction_name"
          value={formData.transaction_name}
          onChange={handleChange}
          placeholder="e.g., Grocery Shopping"
          disabled={isLoading}
        />
        {errors.transaction_name && (
          <span className="form-error">{errors.transaction_name}</span>
        )}
      </div>

      {/* Transaction Type */}
      <div className="form-group">
        <label htmlFor="transaction_type">Type *</label>
        <select
          id="transaction_type"
          name="transaction_type"
          value={formData.transaction_type}
          onChange={handleChange}
          disabled={isLoading}
        >
          {TRANSACTION_TYPES.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
        {errors.transaction_type && (
          <span className="form-error">{errors.transaction_type}</span>
        )}
      </div>

      {/* Transaction Category */}
      <div className="form-group">
        <label htmlFor="transaction_category">Category *</label>
        <select
          id="transaction_category"
          name="transaction_category"
          value={formData.transaction_category}
          onChange={handleChange}
          disabled={isLoading}
        >
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.transaction_category && (
          <span className="form-error">{errors.transaction_category}</span>
        )}
      </div>

      {/* Amount */}
      <div className="form-group">
        <label htmlFor="transaction_value">Amount (USD) *</label>
        <input
          type="number"
          id="transaction_value"
          name="transaction_value"
          value={formData.transaction_value}
          onChange={handleChange}
          placeholder="0.00"
          step="0.01"
          min="0"
          disabled={isLoading}
        />
        {errors.transaction_value && (
          <span className="form-error">{errors.transaction_value}</span>
        )}
      </div>

      {/* Date */}
      <div className="form-group">
        <label htmlFor="transaction_date">Date *</label>
        <input
          type="date"
          id="transaction_date"
          name="transaction_date"
          value={formData.transaction_date}
          onChange={handleChange}
          disabled={isLoading}
        />
        {errors.transaction_date && (
          <span className="form-error">{errors.transaction_date}</span>
        )}
      </div>

      {/* Account Type */}
      <div className="form-group">
        <label htmlFor="account_type">Account *</label>
        <select
          id="account_type"
          name="account_type"
          value={formData.account_type}
          onChange={handleChange}
          disabled={isLoading}
        >
          {ACCOUNT_TYPES.map((account) => (
            <option key={account} value={account}>
              {account.charAt(0).toUpperCase() + account.slice(1)} Account
            </option>
          ))}
        </select>
        {errors.account_type && (
          <span className="form-error">{errors.account_type}</span>
        )}
      </div>

      {/* Submit Button */}
      <button type="submit" className="form-submit-button" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Add Transaction'}
      </button>
    </form>
  )
}
