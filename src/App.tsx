import { useState } from 'react'
import './App.css'

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleLoginClick = () => {
    setShowLoginModal(true)
  }

  const handleCloseModal = () => {
    setShowLoginModal(false)
  }

  return (
    <div className="app">
      {/* Header/Navigation */}
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <span className="logo-icon">💰</span>
            <h1>FinanceFlow</h1>
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
      {showLoginModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>
              ✕
            </button>
            <h2>Welcome Back</h2>
            <form className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button type="submit" className="submit-button">
                Sign In
              </button>
            </form>
            <p className="form-footer">
              Don't have an account?{' '}
              <a href="#signup" className="signup-link">
                Sign up here
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2026 Personal Finance App. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
