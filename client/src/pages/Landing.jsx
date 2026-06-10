import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">✦ Powered by AI</div>
        <h1>Write Cold Emails That Actually Get Replies — In Seconds.</h1>
        <p>
          Stop writing cold emails from scratch. OutreachAI generates complete
          follow-up sequences personalized to your prospect — cold opener,
          follow-up, and breakup — in one click.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn btn-primary btn-lg">
            Get Started Free
          </Link>
          <Link to="/pricing" className="btn btn-secondary btn-lg">
            View Pricing
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>3-Email Sequences</h3>
          <p>
            Every generation gives you a complete outreach sequence — cold
            opener, follow-up, and breakup email — ready to send.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🎯</div>
          <h3>Personalized Outreach</h3>
          <p>
            Input your prospect's name, company, and job title. Our AI writes
            conversational, relevant emails that don't sound like templates.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⏱️</div>
          <h3>Done in Seconds</h3>
          <p>
            No more staring at a blank screen. Fill in a few details and get a
            complete sequence in under 10 seconds.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3>Private & Secure</h3>
          <p>
            Your data stays yours. We never store or share your prospect
            information beyond what's needed to generate your emails.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">₿</div>
          <h3>Pay with Bitcoin</h3>
          <p>
            Privacy-first billing. Upgrade to unlimited generations for just
            $19/month paid securely via Bitcoin.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📈</div>
          <h3>Boost Reply Rates</h3>
          <p>
            Conversational, human-sounding emails that stand out in crowded
            inboxes and actually get responses.
          </p>
        </div>
      </section>

      {/* Pricing Summary */}
      <section style={{ padding: '3rem 1.5rem', maxWidth: '800px', margin: '0 auto' }}>
        <div className="section-header">
          <h2>Simple, Transparent Pricing</h2>
          <p>Start for free. Upgrade when you need more.</p>
        </div>
        <div className="pricing-grid" style={{ marginTop: '2rem' }}>
          <div className="pricing-card">
            <div className="plan-name">Free</div>
            <div className="plan-price">$0</div>
            <div className="plan-period">forever</div>
            <div className="plan-description">Perfect for testing the waters.</div>
            <ul className="plan-features">
              <li>3 email generations per month</li>
              <li>Complete 3-email sequences</li>
              <li>Basic personalization</li>
            </ul>
            <Link to="/register" className="btn btn-secondary" style={{ width: '100%', textAlign: 'center' }}>
              Get Started
            </Link>
          </div>
          <div className="pricing-card featured">
            <div className="plan-name">Pro</div>
            <div className="plan-price">$19</div>
            <div className="plan-period">/month</div>
            <div className="plan-description">For serious outreach campaigns.</div>
            <ul className="plan-features">
              <li>Unlimited email generations</li>
              <li>Complete 3-email sequences</li>
              <li>Advanced personalization</li>
              <li>Priority support</li>
            </ul>
            <Link to="/pricing" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>
              Subscribe Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>OutreachAI &mdash; Cold emails that get replies.</p>
      </footer>
    </div>
  )
}