import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>Page not found — the URL you're looking for doesn't exist.</p>
      <Link to="/" className="btn btn-primary">
        ← Back to Home
      </Link>
    </div>
  )
}