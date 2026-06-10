import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { useAuth } from '../context/AuthContext'

const BITCOIN_ADDRESS = 'bc1qs5jhsj3hnkapa9fhnzttupl65t3x00362xgk4a'

export default function Pricing() {
  const { user, api } = useAuth()
  const [txId, setTxId] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [verifyResult, setVerifyResult] = useState(null)
  const [copied, setCopied] = useState(false)
  const [copiedQrData, setCopiedQrData] = useState(false)

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(BITCOIN_ADDRESS)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
      const textarea = document.createElement('textarea')
      textarea.value = BITCOIN_ADDRESS
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleVerify = async () => {
    if (!txId.trim()) return
    setVerifying(true)
    setVerifyResult(null)
    try {
      const res = await api.post('/payments/verify', { transactionId: txId.trim() })
      setVerifyResult({ success: true, message: res.data.message || 'Payment verified! Your account has been upgraded to Pro.' })
    } catch (err) {
      setVerifyResult({ success: false, message: err.response?.data?.error || 'Verification failed. Please check your transaction ID.' })
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div className="page-content">
      <div className="pricing-page">
        <h1>Simple Pricing</h1>
        <p className="pricing-subtitle">
          Start for free. Upgrade to unlimited when you're ready.
        </p>

        <div className="pricing-grid">
          {/* Free Tier */}
          <div className="pricing-card">
            <div className="plan-name">Free</div>
            <div className="plan-price">$0</div>
            <div className="plan-period">forever</div>
            <div className="plan-description">
              Perfect for trying out OutreachAI and getting a feel for the quality.
            </div>
            <ul className="plan-features">
              <li>3 email generations per month</li>
              <li>Complete 3-email sequences</li>
              <li>Cold opener, follow-up &amp; breakup</li>
              <li>Personalized for each prospect</li>
            </ul>
            {user ? (
              <a href="/generate" className="btn btn-secondary" style={{ width: '100%', textAlign: 'center', display: 'block' }}>
                Your Current Plan
              </a>
            ) : (
              <a href="/register" className="btn btn-secondary" style={{ width: '100%', textAlign: 'center', display: 'block' }}>
                Get Started Free
              </a>
            )}
          </div>

          {/* Pro Tier */}
          <div className="pricing-card featured">
            <div className="plan-name">Pro</div>
            <div className="plan-price">$19</div>
            <div className="plan-period">/month</div>
            <div className="plan-description">
              For sales professionals and founders who need unlimited sequences.
            </div>
            <ul className="plan-features">
              <li>Unlimited email generations</li>
              <li>Complete 3-email sequences</li>
              <li>Cold opener, follow-up &amp; breakup</li>
              <li>Advanced personalization</li>
              <li>Priority support</li>
            </ul>

            {/* Bitcoin Payment Section */}
            <div className="bitcoin-section">
              <h4>Pay with Bitcoin</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Send exactly <strong>$19 worth of Bitcoin</strong> to the address below, then paste your transaction ID to verify.
              </p>

              {/* QR Code */}
              <div className="bitcoin-qr">
                <QRCodeSVG
                  value={`bitcoin:${BITCOIN_ADDRESS}`}
                  size={180}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="M"
                />
              </div>

              {/* Bitcoin Address */}
              <div className="bitcoin-address">
                <span style={{ flex: 1 }}>{BITCOIN_ADDRESS}</span>
                <button className="copy-btn" onClick={handleCopyAddress}>
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>

              {/* Transaction ID Verification */}
              {user ? (
                <>
                  <div className="payment-verify">
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Paste Bitcoin transaction ID"
                      value={txId}
                      onChange={(e) => setTxId(e.target.value)}
                    />
                    <button
                      className="btn btn-primary"
                      onClick={handleVerify}
                      disabled={verifying || !txId.trim()}
                    >
                      {verifying ? 'Verifying...' : 'Verify Payment'}
                    </button>
                  </div>
                  {verifyResult && (
                    <div className={`alert ${verifyResult.success ? 'alert-success' : 'alert-error'}`} style={{ marginTop: '0.75rem' }}>
                      {verifyResult.message}
                    </div>
                  )}
                </>
              ) : (
                <div className="alert alert-info" style={{ marginTop: '0.75rem' }}>
                  <a href="/login" style={{ textDecoration: 'underline' }}>Sign in</a> to verify your payment and activate Pro.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}