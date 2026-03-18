import { useState } from 'react'

interface LoginFormData {
  username: string
  password: string
}

interface LoginFormProps {
  onSubmit?: (data: LoginFormData) => Promise<void>
  isLoading?: boolean
}

export function LoginForm({ onSubmit, isLoading = false }: LoginFormProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!username) {
      setError('Username is required')
      return
    }

    if (!password) {
      setError('Password is required')
      return
    }

    if (onSubmit) {
      try {
        await onSubmit({ username, password })
        // Clear form on success
        setUsername('')
        setPassword('')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      }
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          placeholder="your_username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
      {error && <div style={{ color: '#dc3545', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</div>}
      <button type="submit" className="submit-button" disabled={isLoading}>
        {isLoading ? 'Signing In...' : 'Sign In'}
      </button>
    </form>
  )
}
