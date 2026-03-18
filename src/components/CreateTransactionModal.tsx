import { useEffect } from 'react'
import { CreateTransactionForm } from './CreateTransactionForm'
import type { CreateTransactionPayload } from '../hooks/useCreateTransaction'
import './CreateTransactionModal.css'

interface CreateTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (payload: CreateTransactionPayload) => Promise<void>
  isLoading: boolean
  message: string
  userId: number
}

export function CreateTransactionModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  message,
  userId,
}: CreateTransactionModalProps) {
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !isLoading && !message) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose, isLoading, message])

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading && !message) {
      onClose()
    }
  }

  if (!isOpen) {
    return null
  }

  const isSuccess = message.includes('successfully')

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content create-transaction-modal-content">
        <div className="modal-header">
          <h2>Add New Transaction</h2>
          <button
            className="modal-close-button"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {message && (
          <div className={`modal-message ${isSuccess ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {isSuccess ? (
          <div className="modal-success-content">
            <div className="success-icon">✓</div>
            <p>Transaction added successfully!</p>
            <button className="modal-action-button" onClick={onClose}>
              Return to Dashboard
            </button>
          </div>
        ) : (
          <CreateTransactionForm
            userId={userId}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
        )}

        {!isSuccess && (
          <button className="modal-cancel-button" onClick={onClose} disabled={isLoading}>
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}
