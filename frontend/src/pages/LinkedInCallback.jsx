import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Linkedin, CheckCircle, XCircle } from 'lucide-react'
import api from '../api/axios'
import toast from 'react-hot-toast'

/**
 * LinkedInCallback
 * ================
 * Handles the OAuth 2.0 redirect from LinkedIn.
 * LinkedIn sends the user to /linkedin/callback?code=...&state=...
 * This page picks up those params, calls our backend, then redirects to Settings.
 */
export default function LinkedInCallback() {
    const navigate = useNavigate()
    const location = useLocation()
    const [status, setStatus] = useState('loading') // 'loading' | 'success' | 'error'
    const [message, setMessage] = useState('')

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const code = params.get('code')
        const state = params.get('state')
        const error = params.get('error')

        if (error) {
            setStatus('error')
            setMessage(`LinkedIn denied access: ${params.get('error_description') ?? error}`)
            return
        }

        if (!code) {
            setStatus('error')
            setMessage('No authorization code received from LinkedIn.')
            return
        }

        // Exchange the code for a token via our backend
        api.post('/linkedin/callback', { code, state: state ?? 'linkedin_oauth' })
            .then(({ data }) => {
                setStatus('success')
                setMessage(data.message ?? 'LinkedIn connected!')

                // Update cached user info
                const user = JSON.parse(localStorage.getItem('user') ?? '{}')
                localStorage.setItem('user', JSON.stringify({ ...user, linkedin_connected: true }))

                toast.success('LinkedIn connected successfully!')
                setTimeout(() => navigate('/dashboard/settings'), 2000)
            })
            .catch((err) => {
                setStatus('error')
                const detail = err.response?.data?.detail ?? 'Failed to connect LinkedIn account.'
                setMessage(detail)
                toast.error(detail)
            })
    }, [])

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(160deg, #EFF6FF 0%, #F8FAFC 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
        }}>
            <div style={{ textAlign: 'center', maxWidth: 440 }}>
                {status === 'loading' && (
                    <>
                        <div style={{
                            width: 64, height: 64, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 24px',
                            boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
                            animation: 'pulse 1.5s ease-in-out infinite',
                        }}>
                            <Linkedin size={32} color="white" />
                        </div>
                        <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.4rem', color: '#0F172A', marginBottom: 8 }}>
                            Connecting LinkedIn…
                        </h2>
                        <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
                            Please wait while we securely connect your account.
                        </p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div style={{
                            width: 64, height: 64, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #10B981, #059669)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 24px',
                            boxShadow: '0 8px 24px rgba(16,185,129,0.3)',
                        }}>
                            <CheckCircle size={32} color="white" />
                        </div>
                        <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.4rem', color: '#0F172A', marginBottom: 8 }}>
                            LinkedIn Connected!
                        </h2>
                        <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
                            {message} Redirecting to settings…
                        </p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div style={{
                            width: 64, height: 64, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 24px',
                            boxShadow: '0 8px 24px rgba(239,68,68,0.3)',
                        }}>
                            <XCircle size={32} color="white" />
                        </div>
                        <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.4rem', color: '#0F172A', marginBottom: 8 }}>
                            Connection Failed
                        </h2>
                        <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: 24 }}>
                            {message}
                        </p>
                        <button
                            className="btn-primary"
                            onClick={() => navigate('/dashboard/settings')}
                            style={{ justifyContent: 'center' }}
                        >
                            Back to Settings
                        </button>
                    </>
                )}
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50%       { transform: scale(1.08); opacity: 0.85; }
                }
            `}</style>
        </div>
    )
}
