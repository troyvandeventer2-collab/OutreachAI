import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { api } = useAuth()
  const [profile, setProfile] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedEmail, setSelectedEmail] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, historyRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/generations').catch(() => ({ data: [] })),
        ])
        setProfile(profileRes.data)
        setHistory(historyRes.data || [])
      } catch (err) {
        console.error('Failed to load dashboard', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [api])

  if (loading) {
    return (
      <div className="loading" style={{ minHeight: '60vh' }}>
        <div className="spinner" />
        Loading dashboard...
      </div>
    )
  }

  const tier = profile?.user?.tier || 'free'
  const emailsUsed = profile?.user?.emailsUsed || 0
  const emailsLimit = tier === 'free' ? 3 : Infinity
  const remaining = tier === 'free' ? Math.max(0, emailsLimit - emailsUsed) : '∞'

  return (
    <div className="container dashboard" style={{ padding: '2rem 1.5rem' }}>
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Welcome back{tier === 'free' ? ' — you\'re on the Free plan' : ' — you\'re on the Pro plan'}.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/generate" className="btn btn-primary">
            ✦ Generate New Sequence
          </Link>
          {tier === 'free' && (
            <Link to="/pricing" className="btn btn-outline">
              Upgrade
            </Link>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Plan</div>
          <div className="stat-value">
            <span className="accent">{tier === 'free' ? 'Free' : 'Pro'}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Generations Used</div>
          <div className="stat-value">{emailsUsed}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Generations Remaining</div>
          <div className="stat-value">
            {remaining === '∞' ? '∞' : remaining}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Sequences</div>
          <div className="stat-value">{history.length}</div>
        </div>
      </div>

      {/* History */}
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
        Generation History
      </h2>

      {history.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
            No email sequences generated yet.
          </p>
          <Link to="/generate" className="btn btn-primary">
            Generate Your First Sequence
          </Link>
        </div>
      ) : (
        <div>
          {history.map((item, idx) => (
            <div
              key={item.id || idx}
              className="card"
              style={{ marginBottom: '1rem', cursor: 'pointer' }}
              onClick={() => setSelectedEmail(selectedEmail?.id === item.id ? null : item)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{item.prospectName || item.prospect_name || 'Unknown'}</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: '0.75rem' }}>
                    {item.company || item.prospect_company || ''}
                  </span>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString()
                    : item.created_at
                      ? new Date(item.created_at).toLocaleDateString()
                      : ''}
                </span>
              </div>
              {selectedEmail?.id === item.id && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                  {item.emails ? (
                    item.emails.map((email, i) => (
                      <div
                        key={i}
                        style={{
                          padding: '0.75rem',
                          marginBottom: '0.5rem',
                          background: 'var(--bg-input)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.85rem',
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        <strong style={{ color: 'var(--accent)' }}>
                          {email.type === 'cold' ? '📩 Cold Opener' :
                           email.type === 'followup' ? '📧 Follow-Up' :
                           email.type === 'breakup' ? '💔 Breakup' : 'Email'}
                        </strong>
                        <p style={{ marginTop: '0.4rem', color: 'var(--text-secondary)' }}>{email.body}</p>
                      </div>
                    ))
                  ) : item.coldEmail ? (
                    <>
                      <div style={{
                        padding: '0.75rem',
                        marginBottom: '0.5rem',
                        background: 'var(--bg-input)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.85rem',
                        whiteSpace: 'pre-wrap',
                      }}>
                        <strong style={{ color: 'var(--accent)' }}>📩 Cold Opener</strong>
                        <p style={{ marginTop: '0.4rem', color: 'var(--text-secondary)' }}>{item.coldEmail}</p>
                      </div>
                      {item.followUpEmail && (
                        <div style={{
                          padding: '0.75rem',
                          marginBottom: '0.5rem',
                          background: 'var(--bg-input)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.85rem',
                          whiteSpace: 'pre-wrap',
                        }}>
                          <strong style={{ color: 'var(--warning)' }}>📧 Follow-Up</strong>
                          <p style={{ marginTop: '0.4rem', color: 'var(--text-secondary)' }}>{item.followUpEmail}</p>
                        </div>
                      )}
                      {item.breakupEmail && (
                        <div style={{
                          padding: '0.75rem',
                          marginBottom: '0.5rem',
                          background: 'var(--bg-input)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.85rem',
                          whiteSpace: 'pre-wrap',
                        }}>
                          <strong style={{ color: 'var(--danger)' }}>💔 Breakup</strong>
                          <p style={{ marginTop: '0.4rem', color: 'var(--text-secondary)' }}>{item.breakupEmail}</p>
                        </div>
                      )}
                    </>
                  ) : null}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}