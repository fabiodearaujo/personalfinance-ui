import { LoginForm } from './LoginForm'

interface LoginFormData {
  username: string
  password: string
}

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: (data: LoginFormData) => Promise<void>
  onSwitchToSignUp?: () => void
  isLoading?: boolean
  message?: { type: 'success' | 'error'; text: string } | null
}

export function LoginModal({
  isOpen,
  onClose,
  onSubmit,
  onSwitchToSignUp,
  isLoading = false,
  message,
}: LoginModalProps) {
  if (!isOpen) return null

  const handleOverlayClick = () => {
    // Prevent closing modal when clicking outside - only allow X button or successful login
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
        <h2>Welcome Back</h2>
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
        <LoginForm onSubmit={onSubmit} isLoading={isLoading} />
        <p className="form-footer">
          Don't have an account?{' '}
          <a
            href="#signup"
            className="signup-link"
            onClick={(e) => {
              e.preventDefault()
              if (onSwitchToSignUp) {
                onSwitchToSignUp()
              }
            }}
          >
            Sign up here
          </a>
        </p>
      </div>
    </div>
  )
}
