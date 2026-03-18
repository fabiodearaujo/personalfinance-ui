import { useState, useEffect } from 'react'
import { LoginModal } from './components/LoginModal'
import { SignUpModal } from './components/SignUpModal'
import { Dashboard } from './components/Dashboard'
import { Transactions } from './components/Transactions'
import { useSignUp } from './hooks/useSignUp'
import { useLogin } from './hooks/useLogin'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSignUpModal, setShowSignUpModal] = useState(false)
  const [currentView, setCurrentView] = useState<'dashboard' | 'transactions'>('dashboard')
  const [mainBalance, setMainBalance] = useState(0)

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      setIsLoggedIn(true)
    }
  }, [])

  const {
    isLoading: isSignUpLoading,
    message: signUpMessage,
    handleSignUpSubmit,
    clearMessage: clearSignUpMessage,
  } = useSignUp(
    // onSuccess callback
    () => {
      setShowSignUpModal(false)
      setShowLoginModal(true)
    },
    // onError callback
    undefined
  )

  const {
    isLoading: isLoginLoading,
    message: loginMessage,
    handleLoginSubmit: handleLoginSubmitAPI,
    clearMessage: clearLoginMessage,
  } = useLogin(
    // onSuccess callback
    () => {
      setShowLoginModal(false)
      setIsLoggedIn(true)
      console.log('User logged in successfully')
    },
    // onError callback
    undefined
  )

  const handleLoginClick = () => {
    setShowSignUpModal(false)
    setShowLoginModal(true)
  }

  const handleCloseLoginModal = () => {
    setShowLoginModal(false)
    clearLoginMessage()
  }

  const handleLoginSubmit = (formData: { username: string; password: string }) => {
    return handleLoginSubmitAPI(formData)
  }

  const handleSignUpClick = () => {
    setShowLoginModal(false)
    setShowSignUpModal(true)
  }

  const handleCloseSignUpModal = () => {
    setShowSignUpModal(false)
    clearSignUpMessage()
  }

  const handleSwitchToLogin = () => {
    setShowSignUpModal(false)
    setShowLoginModal(true)
    clearSignUpMessage()
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('token_type')
    setIsLoggedIn(false)
    setCurrentView('dashboard')
  }

  const handleViewTransactions = (balance: number) => {
    setMainBalance(balance)
    setCurrentView('transactions')
  }

  const handleBackToDashboard = () => {
    setCurrentView('dashboard')
  }

  // Show dashboard if logged in
  if (isLoggedIn) {
    if (currentView === 'transactions') {
      return <Transactions balance={mainBalance} onBack={handleBackToDashboard} />
    }
    return <Dashboard onLogout={handleLogout} onViewTransactions={handleViewTransactions} />
  }

  return (
    <div className="app">
      {/* Header/Navigation */}
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <span className="logo-icon">💰</span>
            <h1>Personal Finance App</h1>
          </div>
          <button className="login-button" onClick={handleLoginClick}>
            Log In
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h2 className="hero-title">
            Take Control of Your Financial Future
          </h2>
          <p className="hero-subtitle">
            Track your expenses, manage budgets, and achieve your financial goals
            with our intuitive personal finance platform.
          </p>
          <button className="cta-button" onClick={handleLoginClick}>
            Get Started
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <h2 className="section-title">Why Choose FinanceFlow?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Real-time Analytics</h3>
              <p>
                Visualize your spending patterns with detailed charts and
                insights to make informed financial decisions.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Bank-Level Security</h3>
              <p>
                Your financial data is protected with enterprise-grade encryption
                and security protocols.
              </p>
            </div>
            {/* <div className="feature-card">
              <div className="feature-icon">💡</div>
              <h3>Smart Budgeting</h3>
              <p>
                Create and manage budgets smartly with AI-powered recommendations
                to optimize your spending.
              </p>
            </div> */}
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Goal Tracking</h3>
              <p>
                Set financial goals and track your progress towards savings,
                investments, and major purchases.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to manage your finances better?</h2>
        <button className="primary-button" onClick={handleLoginClick}>
          Sign In Now
        </button>
      </section>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={handleCloseLoginModal}
        onSubmit={handleLoginSubmit}
        onSwitchToSignUp={handleSignUpClick}
        isLoading={isLoginLoading}
        message={loginMessage}
      />

      {/* Sign Up Modal */}
      <SignUpModal 
        isOpen={showSignUpModal} 
        onClose={handleCloseSignUpModal}
        onSubmit={handleSignUpSubmit}
        onBackToLogin={handleSwitchToLogin}
        isLoading={isSignUpLoading}
        message={signUpMessage}
      />

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2026 Personal Finance App. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
