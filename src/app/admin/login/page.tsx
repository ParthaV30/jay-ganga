'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, User, Eye, EyeOff } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!username || !password) { setError('Both fields are required.'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (res.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        setError('Invalid username or password.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <span className="login-logo-main">JAY GANGA</span>
          <span className="login-logo-sub">Associates · Admin</span>
        </div>
        <h1 className="login-title">Sign In</h1>
        {error && <div className="login-error" role="alert">{error}</div>}
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-user">Username</label>
            <div className="login-input-wrap">
              <User size={15} className="login-input-icon" />
              <input
                id="admin-user"
                className="form-input login-input"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin"
                autoComplete="username"
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-pass">Password</label>
            <div className="login-input-wrap">
              <Lock size={15} className="login-input-icon" />
              <input
                id="admin-pass"
                type={showPassword ? 'text' : 'password'}
                className="form-input login-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                style={{ paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                className="login-toggle-password"
                onClick={() => setShowPassword(p => !p)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-dark login-btn" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          background-color: var(--color-dark);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .login-card {
          width: 100%;
          max-width: 420px;
          background-color: var(--color-bg);
          padding: 3rem 2.5rem;
          border-top: 3px solid var(--color-accent);
        }
        .login-logo {
          display: flex; flex-direction: column; margin-bottom: 2.5rem;
        }
        .login-logo-main {
          font-family: var(--font-heading);
          font-size: 1.3rem; font-weight: 600; letter-spacing: 0.12em;
        }
        .login-logo-sub {
          font-size: 0.7rem; color: var(--color-text-secondary);
          letter-spacing: 0.15em; text-transform: uppercase;
        }
        .login-title {
          font-family: var(--font-heading);
          font-size: 2rem; font-weight: 300; margin-bottom: 1.5rem;
        }
        .login-error {
          padding: 0.75rem 1rem;
          background-color: rgba(231,76,60,0.08);
          border-left: 3px solid #e74c3c;
          font-size: 0.85rem; color: #c0392b;
          margin-bottom: 1.25rem;
        }
        .login-input-wrap { position: relative; }
        :global(.login-input-icon) {
          position: absolute; left: 1rem; top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-secondary);
        }
        .login-input { padding-left: 2.5rem; }
        .login-toggle-password {
          position: absolute; right: 1rem; top: 50%;
          transform: translateY(-50%);
          background: none; border: none;
          color: var(--color-text-secondary);
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          padding: 0;
          transition: color 0.15s ease;
        }
        .login-toggle-password:hover { color: var(--color-text); }
        .login-btn { width: 100%; justify-content: center; margin-top: 0.5rem; }
      `}</style>
    </div>
  )
}
