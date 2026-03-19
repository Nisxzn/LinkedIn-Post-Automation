import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Linkedin, Mail, Lock, ArrowRight, Eye, EyeOff, User } from 'lucide-react'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const { login } = useAuth()
    const query = new URLSearchParams(location.search)
    const initialMode = query.get('mode') === 'signup'

    const [isSignup, setIsSignup] = useState(initialMode)
    const [form, setForm] = useState({ name: '', email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [showPw, setShowPw] = useState(false)

    useEffect(() => {
        setIsSignup(query.get('mode') === 'signup')
    }, [location.search])

    // If already logged in, redirect to dashboard
    useEffect(() => {
        if (localStorage.getItem('token')) navigate('/dashboard')
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (isSignup && !form.name.trim()) { toast.error('Please enter your name'); return }
        if (!form.email || !form.password) { toast.error('Please fill in all fields'); return }
        if (isSignup && form.password.length < 8) { toast.error('Password must be at least 8 characters'); return }

        setLoading(true)
        try {
            if (isSignup) {
                await api.post('/auth/signup', { name: form.name, email: form.email, password: form.password })
                toast.success('Account created! Please sign in.')
                setIsSignup(false)
                setForm({ name: '', email: form.email, password: '' })
                navigate('/login?mode=login')
            } else {
                const { data } = await api.post('/auth/login', { email: form.email, password: form.password })
                // Use AuthContext.login() — stores token + user in localStorage and React state
                login(data.access_token, data.user ?? { email: form.email })
                toast.success(`Welcome back, ${data.user?.name ?? ''}! `)
                navigate('/dashboard')
            }
        } catch (err) {
            toast.error(err.response?.data?.detail ?? (isSignup ? 'Signup failed' : 'Invalid credentials'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(160deg, #EFF6FF 0%, #F8FAFC 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
        }}>
            <div style={{ width: '100%', maxWidth: 440 }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 36 }}>
                    <div style={{
                        width: 54, height: 54, borderRadius: 16,
                        background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px',
                        boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
                    }}>
                        <Linkedin size={26} color="white" />
                    </div>
                    <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '1.6rem', color: '#0F172A', marginBottom: 6 }}>
                        {isSignup ? 'Create account' : 'Welcome back'}
                    </h1>
                    <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
                        {isSignup ? 'Join LinkedAI and start automating' : 'Sign in to your LinkedAI account'}
                    </p>
                </div>

                {/* Card */}
                <div className="card animate-fade-in" style={{ padding: '36px 32px' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {/* Name (Signup only) */}
                        {isSignup && (
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: 7 }}>
                                    Full Name
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <User size={16} color="#94A3B8" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }} />
                                    <input
                                        id="name"
                                        type="text"
                                        className="input-field"
                                        placeholder="John Doe"
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        style={{ paddingLeft: 40 }}
                                        autoComplete="name"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: 7 }}>
                                Email address
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    id="email"
                                    type="email"
                                    className="input-field"
                                    placeholder="you@company.com"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    style={{ paddingLeft: 40 }}
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: 7 }}>
                                Password {isSignup && <span style={{ color: '#94A3B8', fontWeight: 400 }}>(min. 8 characters)</span>}
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} color="#94A3B8" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    id="password"
                                    type={showPw ? 'text' : 'password'}
                                    className="input-field"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    style={{ paddingLeft: 40, paddingRight: 40 }}
                                    autoComplete={isSignup ? 'new-password' : 'current-password'}
                                />
                                <button type="button" onClick={() => setShowPw(!showPw)} style={{
                                    position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)',
                                    background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8',
                                }}>
                                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            id="auth-submit-btn"
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                            style={{
                                width: '100%', justifyContent: 'center', padding: '12px', marginTop: 4, fontSize: '0.95rem',
                                opacity: loading ? 0.75 : 1, cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" style={{ animation: 'spin 0.8s linear infinite' }}>
                                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" fill="none" strokeDasharray="31.4" strokeDashoffset="10" />
                                </svg>
                            ) : <>{isSignup ? 'Create Account' : 'Sign In'} <ArrowRight size={16} /></>}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: 24 }}>
                        <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
                            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                            <button
                                onClick={() => {
                                    setForm({ name: '', email: '', password: '' })
                                    navigate(isSignup ? '/login?mode=login' : '/login?mode=signup')
                                }}
                                style={{ background: 'none', border: 'none', color: '#2563EB', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                            >
                                {isSignup ? 'Sign in' : 'Sign up'}
                            </button>
                        </p>
                    </div>
                </div>

                <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.82rem', color: '#94A3B8' }}>
                    By {isSignup ? 'creating an account' : 'signing in'}, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}
