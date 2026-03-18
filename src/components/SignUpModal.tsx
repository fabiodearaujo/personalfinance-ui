import { SignUpForm } from './SignUpForm'

interface SignUpFormData {
  email: string
  password: string
}

interface SignUpModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: (data: SignUpFormData) => Promise<void>
  onBackToLogin?: () => void
  isLoading?: boolean
  message?: { type: 'success' | 'error'; text: string } | null
}

export function SignUpModal({
  isOpen,
  onClose,
  onSubmit,
  onBackToLogin,
  isLoading = false,
  message,
}: SignUpModalProps) {
  if (!isOpen) return null

  const handleOverlayClick = () => {
    // Prevent closing modal when clicking outside - only allow X button or success
  }

  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={handleContentClick}>
        <button className="modal-close" onClick={onClose} disabled={isLoading}>
          ✕
        </button>
        <h2>Create Your Account</h2>
        {message && (
          <div
            style={{
              padding: '1rem',
              borderRadius: '6px',
              marginBottom: '1rem',
              backgroundColor:
                message.type === 'success'
                  ? '#d4edda'
                  : '#f8d7da',
              color:
                message.type === 'success'
                  ? '#155724'
                  : '#721c24',
              border: `1px solid ${
                message.type === 'success'
                  ? '#c3e6cb'
                  : '#f5c6cb'
              }`,
            }}
          >
            {message.text}
          </div>
        )}
        <SignUpForm onSubmit={onSubmit} isLoading={isLoading} />
        <p className="form-footer">
          Already have an account?{' '}
          <a
            href="#login"
            className="signup-link"
            onClick={(e) => {
              e.preventDefault()
              if (onBackToLogin) {
                onBackToLogin()
              }
            }}
          >
            Sign in here
          </a>
        </p>
      </div>
    </div>
  )
}
