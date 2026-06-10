import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Generator() {
  const { api } = useAuth()
  const [form, setForm] = useState({
    yourName: '',
    whatYouSell: '',
    prospectName: '',
    prospectCompany: '',
    prospectTitle: '',
  })
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copiedIndex, setCopiedIndex] = useState(null)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setResults(null)
    setLoading(true)
    try {
      const res = await api.post('/generate', {
        user_name: form.yourName,
        what_they_sell: form.whatYouSell,
        prospect_name: form.prospectName,
        prospect_company: form.prospectCompany,
        prospect_title: form.prospectTitle,
      })
      setResults(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Generation failed. Check your plan limit.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch {
      // fallback
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    }
  }

  const getEmailType = (idx) => {
    if (idx === 0) return { label: 'Cold Opener', badge: 'cold', icon: '📩' }
    if (idx === 1) return { label: 'Follow-Up', badge: 'followup', icon: '📧' }
    return { label: 'Breakup', badge: 'breakup', icon: '💔' }
  }

  return (
    <div className="generator-page">
      <h1>Generate Email Sequence</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
        Fill in the details below and get a complete 3-email sequence in seconds.
      </p>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="generator-form">
        <div className="form-group">
          <label>Your Name</label>
          <input
            type="text"
            name="yourName"
            className="form-input"
            placeholder="John Doe"
            value={form.yourName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>What do you sell?</label>
          <input
            type="text"
            name="whatYouSell"
            className="form-input"
            placeholder="AI-powered analytics platform"
            value={form.whatYouSell}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Prospect's Name</label>
            <input
              type="text"
              name="prospectName"
              className="form-input"
              placeholder="Jane Smith"
              value={form.prospectName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Prospect's Company</label>
            <input
              type="text"
              name="prospectCompany"
              className="form-input"
              placeholder="Acme Corp"
              value={form.prospectCompany}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label>Prospect's Job Title</label>
          <input
            type="text"
            name="prospectTitle"
            className="form-input"
            placeholder="VP of Engineering"
            value={form.prospectTitle}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
          {loading ? (
            <>
              <div className="spinner" style={{ width: '18px', height: '18px', margin: 0 }} />
              Generating...
            </>
          ) : (
            '✦ Generate Sequence'
          )}
        </button>
      </form>

      {/* Results */}
      {results && (
        <div className="email-results">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
            Your Email Sequence
          </h2>

          {results.emails && results.emails.length > 0 ? (
            results.emails.map((email, idx) => {
              const { label, badge, icon } = getEmailType(idx)
              return (
                <div key={idx} className="email-result-card">
                  <div className="email-result-header">
                    <h3>
                      {icon} {label}
                    </h3>
                    <span className={`email-badge ${badge}`}>{badge}</span>
                  </div>
                  <pre className="email-body email-body-pre">{email}</pre>
                  <div className="email-actions">
                    <button
                      className={`btn btn-sm ${copiedIndex === idx ? 'btn-outline' : 'btn-secondary'}`}
                      onClick={() => copyToClipboard(email, idx)}
                    >
                      {copiedIndex === idx ? '✓ Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              )
            })
          ) : (
            // Fallback for flat response structure
            <>
              {results.coldEmail && (
                <div className="email-result-card">
                  <div className="email-result-header">
                    <h3>📩 Cold Opener</h3>
                    <span className="email-badge cold">cold</span>
                  </div>
                  <pre className="email-body email-body-pre">{results.coldEmail}</pre>
                  <div className="email-actions">
                    <button
                      className={`btn btn-sm ${copiedIndex === 0 ? 'btn-outline' : 'btn-secondary'}`}
                      onClick={() => copyToClipboard(results.coldEmail, 0)}
                    >
                      {copiedIndex === 0 ? '✓ Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}
              {results.followUpEmail && (
                <div className="email-result-card">
                  <div className="email-result-header">
                    <h3>📧 Follow-Up</h3>
                    <span className="email-badge followup">follow-up</span>
                  </div>
                  <pre className="email-body email-body-pre">{results.followUpEmail}</pre>
                  <div className="email-actions">
                    <button
                      className={`btn btn-sm ${copiedIndex === 1 ? 'btn-outline' : 'btn-secondary'}`}
                      onClick={() => copyToClipboard(results.followUpEmail, 1)}
                    >
                      {copiedIndex === 1 ? '✓ Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}
              {results.breakupEmail && (
                <div className="email-result-card">
                  <div className="email-result-header">
                    <h3>💔 Breakup</h3>
                    <span className="email-badge breakup">breakup</span>
                  </div>
                  <pre className="email-body email-body-pre">{results.breakupEmail}</pre>
                  <div className="email-actions">
                    <button
                      className={`btn btn-sm ${copiedIndex === 2 ? 'btn-outline' : 'btn-secondary'}`}
                      onClick={() => copyToClipboard(results.breakupEmail, 2)}
                    >
                      {copiedIndex === 2 ? '✓ Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}