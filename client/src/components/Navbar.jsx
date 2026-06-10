import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const isActive = (path) => location.pathname === path ? 'navbar-link active' : 'navbar-link'

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">✧</span>
          OutreachAI
        </Link>

        <div className="navbar-links">
          {user ? (
            <>
              <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
              <Link to="/generate" className={isActive('/generate')}>Generate</Link>
              <Link to="/pricing" className={isActive('/pricing')}>Pricing</Link>
              <button
                onClick={logout}
                className="navbar-link"
                style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/" className={isActive('/')}>Home</Link>
              <Link to="/pricing" className={isActive('/pricing')}>Pricing</Link>
              <Link to="/login" className="btn btn-primary btn-sm">Sign In</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}