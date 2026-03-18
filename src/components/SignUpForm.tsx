import { useState } from 'react'

interface SignUpFormData {
  email: string
  password: string
}

interface SignUpFormProps {
  onSubmit?: (data: SignUpFormData) => Promise<void>
  isLoading?: boolean
}

export function SignUpForm({ onSubmit, isLoading = false }: SignUpFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    if (!email) {
      setError('Email is required')
      return
    }

    if (onSubmit) {
      try {
        await onSubmit({ email, password })
        // Clear form on success
        setEmail('')
        setPassword('')
        setConfirmPassword('')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      }
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <div className="form-group">
        <label htmlFor="confirm-password">Confirm Password</label>
        <input
          type="password"
          id="confirm-password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      {error && <div style={{ color: '#dc3545', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</div>}
      <button type="submit" className="submit-button" disabled={isLoading}>
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  )
}
