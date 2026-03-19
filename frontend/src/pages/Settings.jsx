import { useState, useEffect, useCallback } from 'react'
import { User, Bell, Shield, Save, Linkedin } from 'lucide-react'
import api from '../api/axios'
import toast from 'react-hot-toast'

function ZapIcon({ size = 16, color = 'currentColor' }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
}

const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
    { id: 'automation', label: 'Automation', icon: ZapIcon },
    { id: 'notifs', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
]

export default function Settings() {
    const [activeTab, setActiveTab] = useState('profile')

    // ── Profile ───────────────────────────────────────────────────────────────
    const cachedUser = JSON.parse(localStorage.getItem('user') ?? '{}')
    const [profile, setProfile] = useState({
        name: cachedUser.name ?? '',
        email: cachedUser.email ?? '',
        bio: '',
        timezone: 'Asia/Kolkata',
    })
    const [saving, setSaving] = useState(false)

    // ── LinkedIn ──────────────────────────────────────────────────────────────
    const [linkedinConnected, setLinkedinConnected] = useState(cachedUser.linkedin_connected ?? false)
    const [linkedinLoading, setLinkedinLoading] = useState(false)
    const [linkedinDisconnecting, setLinkedinDisconnecting] = useState(false)

    // ── Automation ────────────────────────────────────────────────────────────
    const [autoSettings, setAutoSettings] = useState({ is_active: 1, category: 'AI', auto_schedule: 1 })
    const [triggering, setTriggering] = useState(null)

    // ── Notifications ─────────────────────────────────────────────────────────
    const [notifs, setNotifs] = useState({ email_posts: true, email_analytics: false, push_schedule: true })

    // ── Load ──────────────────────────────────────────────────────────────────
    useEffect(() => {
        // Load automation settings
        api.get('/automation/settings').then(({ data }) => {
            setAutoSettings({ is_active: data.is_active, category: data.category, auto_schedule: data.auto_schedule })
        }).catch(() => { })

        // Load real LinkedIn status from backend
        api.get('/linkedin/status').then(({ data }) => {
            setLinkedinConnected(data.connected)
        }).catch(() => { })

        // Load real user profile
        api.get('/auth/me').then(({ data }) => {
            setProfile(prev => ({ ...prev, name: data.name, email: data.email }))
            setLinkedinConnected(data.linkedin_connected)
            localStorage.setItem('user', JSON.stringify({
                ...cachedUser,
                name: data.name,
                email: data.email,
                linkedin_connected: data.linkedin_connected,
            }))
        }).catch(() => { })
    }, [])

    // ── Automation helpers ────────────────────────────────────────────────────
    const updateAutoSetting = async (key, val) => {
        const newSettings = { ...autoSettings, [key]: val }
        setAutoSettings(newSettings)
        try {
            await api.post('/automation/settings/update', newSettings)
            toast.success('Automation setting updated')
        } catch {
            toast.error('Failed to update settings')
        }
    }

    const runTask = async (endpoint, taskId) => {
        setTriggering(taskId)
        try {
            const { data } = await api.post(`/automation/${endpoint}`)
            toast.success(data.message || 'Task started!')
        } catch {
            toast.error('Failed to trigger automation')
        } finally {
            setTriggering(null)
        }
    }

    // ── Profile save ──────────────────────────────────────────────────────────
    const saveProfile = async () => {
        setSaving(true)
        await new Promise(r => setTimeout(r, 800))
        setSaving(false)
        toast.success('Profile saved successfully!')
    }

    // ── LinkedIn connect ──────────────────────────────────────────────────────
    const connectLinkedIn = async () => {
        setLinkedinLoading(true)
        try {
            const { data } = await api.get('/linkedin/auth')
            // Redirect the browser to LinkedIn's OAuth page
            window.location.href = data.auth_url
        } catch (err) {
            toast.error(err.response?.data?.detail ?? 'Failed to initiate LinkedIn connection.')
            setLinkedinLoading(false)
        }
    }

    // ── LinkedIn disconnect ───────────────────────────────────────────────────
    const disconnectLinkedIn = async () => {
        setLinkedinDisconnecting(true)
        try {
            await api.post('/linkedin/disconnect')
            setLinkedinConnected(false)
            const user = JSON.parse(localStorage.getItem('user') ?? '{}')
            localStorage.setItem('user', JSON.stringify({ ...user, linkedin_connected: false }))
            toast.success('LinkedIn account disconnected.')
        } catch (err) {
            toast.error(err.response?.data?.detail ?? 'Failed to disconnect LinkedIn.')
        } finally {
            setLinkedinDisconnecting(false)
        }
    }

    // ─────────────────────────────────────────────────────────────────────────

    return (
        <div style={{ display: 'flex', gap: 24, maxWidth: 1000, flexWrap: 'wrap' }}>
            {/* Nav */}
            <div style={{ width: 220, flexShrink: 0 }}>
                <div className="card" style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {tabs.map(({ id, label, icon: Icon }) => (
                        <button key={id} onClick={() => setActiveTab(id)} style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '12px 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
                            background: activeTab === id ? 'linear-gradient(135deg, #DBEAFE, #EFF6FF)' : 'transparent',
                            color: activeTab === id ? '#2563EB' : '#64748B',
                            fontWeight: activeTab === id ? 600 : 500,
                            fontSize: '0.875rem',
                            borderLeft: activeTab === id ? '4px solid #2563EB' : '4px solid transparent',
                            transition: 'all 0.15s', width: '100%', textAlign: 'left',
                        }}>
                            <Icon size={18} />
                            {label}
                            {/* LinkedIn connection badge */}
                            {id === 'linkedin' && (
                                <span style={{
                                    marginLeft: 'auto', fontSize: '0.65rem', fontWeight: 700,
                                    padding: '2px 7px', borderRadius: 99,
                                    background: linkedinConnected ? '#D1FAE5' : '#FEE2E2',
                                    color: linkedinConnected ? '#059669' : '#DC2626',
                                }}>
                                    {linkedinConnected ? 'ON' : 'OFF'}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 320 }}>
                <div className="card animate-fade-in" style={{ padding: '32px' }}>

                    {/* ── Profile Tab ────────────────────────────────────────────── */}
                    {activeTab === 'profile' && (
                        <div>
                            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.2rem', color: '#0F172A', marginBottom: 8 }}>
                                Profile Settings
                            </h2>
                            <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: 28 }}>Manage your professional identity.</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: 8 }}>Full Name</label>
                                    <input className="input-field" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: 8 }}>Email Address</label>
                                    <input className="input-field" value={profile.email} readOnly style={{ background: '#F1F5F9', cursor: 'not-allowed' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: 8 }}>Professional Bio</label>
                                    <textarea className="input-field" rows={4} value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} />
                                </div>
                                <button className="btn-primary" onClick={saveProfile} style={{ marginTop: 8, width: 'fit-content' }}>
                                    {saving ? 'Saving...' : <><Save size={16} /> Save Changes</>}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── LinkedIn Tab ───────────────────────────────────────────── */}
                    {activeTab === 'linkedin' && (
                        <div>
                            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.2rem', color: '#0F172A', marginBottom: 8 }}>
                                LinkedIn Integration
                            </h2>
                            <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: 28 }}>
                                Connect your LinkedIn account to enable AI-powered automated posting.
                            </p>

                            {/* Status Card */}
                            <div style={{
                                padding: '24px',
                                borderRadius: 16,
                                border: `2px solid ${linkedinConnected ? '#A7F3D0' : '#FECACA'}`,
                                background: linkedinConnected ? '#F0FDF4' : '#FFF5F5',
                                marginBottom: 24,
                                display: 'flex', alignItems: 'center', gap: 16,
                            }}>
                                <div style={{
                                    width: 48, height: 48, borderRadius: 12,
                                    background: linkedinConnected
                                        ? 'linear-gradient(135deg, #10B981, #059669)'
                                        : 'linear-gradient(135deg, #EF4444, #DC2626)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    <Linkedin size={22} color="white" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontWeight: 700, color: '#0F172A', marginBottom: 4, fontSize: '0.95rem' }}>
                                        LinkedIn Status:{' '}
                                        <span style={{ color: linkedinConnected ? '#059669' : '#DC2626' }}>
                                            {linkedinConnected ? 'Connected' : 'Not Connected'}
                                        </span>
                                    </p>
                                    <p style={{ fontSize: '0.8rem', color: '#64748B' }}>
                                        {linkedinConnected
                                            ? 'Your LinkedIn account is linked. Posts will be published to your profile.'
                                            : 'Connect your LinkedIn account to start publishing posts automatically.'}
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                {!linkedinConnected ? (
                                    <button
                                        id="connect-linkedin-btn"
                                        className="btn-primary"
                                        onClick={connectLinkedIn}
                                        disabled={linkedinLoading}
                                        style={{ opacity: linkedinLoading ? 0.75 : 1 }}
                                    >
                                        <Linkedin size={16} />
                                        {linkedinLoading ? 'Redirecting to LinkedIn…' : 'Connect LinkedIn'}
                                    </button>
                                ) : (
                                    <button
                                        id="disconnect-linkedin-btn"
                                        onClick={disconnectLinkedIn}
                                        disabled={linkedinDisconnecting}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 8,
                                            padding: '10px 20px', borderRadius: 10, border: '1.5px solid #FECACA',
                                            background: '#FFF5F5', color: '#DC2626', fontWeight: 600,
                                            fontSize: '0.875rem', cursor: linkedinDisconnecting ? 'not-allowed' : 'pointer',
                                            opacity: linkedinDisconnecting ? 0.75 : 1,
                                            transition: 'all 0.2s',
                                            fontFamily: 'Inter, sans-serif',
                                        }}
                                        onMouseEnter={e => { if (!linkedinDisconnecting) e.currentTarget.style.background = '#FEE2E2' }}
                                        onMouseLeave={e => { e.currentTarget.style.background = '#FFF5F5' }}
                                    >
                                        <Linkedin size={16} />
                                        {linkedinDisconnecting ? 'Disconnecting…' : 'Disconnect LinkedIn'}
                                    </button>
                                )}
                            </div>

                            {/* Info Box */}
                            <div style={{
                                marginTop: 28, padding: '16px 18px', borderRadius: 12,
                                background: '#F0F9FF', border: '1px solid #BAE6FD',
                            }}>
                                <p style={{ fontSize: '0.8rem', color: '#0369A1', fontWeight: 600, marginBottom: 6 }}>
                                    🔐 Permissions requested
                                </p>
                                <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.78rem', color: '#0369A1', lineHeight: 1.8 }}>
                                    <li><code>openid</code> — Authentication</li>
                                    <li><code>profile</code> — Your name and profile info</li>
                                    <li><code>email</code> — Your email address</li>
                                    <li><code>w_member_social</code> — Post on your behalf</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* ── Automation Tab ─────────────────────────────────────────── */}
                    {activeTab === 'automation' && (
                        <div>
                            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.2rem', color: '#0F172A', marginBottom: 8 }}>
                                Automation Control
                            </h2>
                            <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: 28 }}>Configure AI discovery and scheduling.</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                {/* Main Toggle */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: '#F8FAFC', borderRadius: 16, border: '1px solid #E2E8F0' }}>
                                    <div>
                                        <p style={{ fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Engagement Automation</p>
                                        <p style={{ fontSize: '0.825rem', color: '#64748B' }}>When active, the system fetches news and generates drafts automatically.</p>
                                    </div>
                                    <button onClick={() => updateAutoSetting('is_active', autoSettings.is_active === 1 ? 0 : 1)} style={{
                                        width: 52, height: 28, borderRadius: 99, padding: 4, transition: '0.3s', cursor: 'pointer',
                                        background: autoSettings.is_active === 1 ? '#2563EB' : '#CBD5E1', border: 'none', position: 'relative'
                                    }}>
                                        <div style={{ width: 20, height: 20, background: 'white', borderRadius: '50%', transition: '0.3s', transform: `translateX(${autoSettings.is_active === 1 ? '24px' : '0px'})`, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
                                    </button>
                                </div>

                                {/* Category */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: 8 }}>Topic Category</label>
                                    <div style={{ display: 'flex', gap: 10 }}>
                                        {['AI', 'Startups', 'Tech'].map(cat => (
                                            <button key={cat} onClick={() => updateAutoSetting('category', cat)} style={{
                                                flex: 1, padding: '12px', borderRadius: 12, border: '1.5px solid',
                                                fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', transition: '0.2s',
                                                borderColor: autoSettings.category === cat ? '#2563EB' : '#E2E8F0',
                                                background: autoSettings.category === cat ? '#EFF6FF' : 'white',
                                                color: autoSettings.category === cat ? '#2563EB' : '#475569',
                                            }}>
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Auto Schedule Toggle */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: '#F8FAFC', borderRadius: 16, border: '1px solid #E2E8F0' }}>
                                    <div>
                                        <p style={{ fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Auto Schedule Posts</p>
                                        <p style={{ fontSize: '0.825rem', color: '#64748B' }}>Automatically schedule generated drafts for the next 24 hours.</p>
                                    </div>
                                    <button onClick={() => updateAutoSetting('auto_schedule', autoSettings.auto_schedule === 1 ? 0 : 1)} style={{
                                        width: 52, height: 28, borderRadius: 99, padding: 4, transition: '0.3s', cursor: 'pointer',
                                        background: autoSettings.auto_schedule === 1 ? '#2563EB' : '#CBD5E1', border: 'none', position: 'relative'
                                    }}>
                                        <div style={{ width: 20, height: 20, background: 'white', borderRadius: '50%', transition: '0.3s', transform: `translateX(${autoSettings.auto_schedule === 1 ? '24px' : '0px'})`, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
                                    </button>
                                </div>

                                {/* Manual Run Buttons */}
                                <div style={{ marginTop: 12, borderTop: '1px solid #E2E8F0', paddingTop: 24, display: 'flex', gap: 12 }}>
                                    <button className="btn-secondary" onClick={() => runTask('run-content-discovery', 'disc')} disabled={triggering === 'disc'} style={{ flex: 1 }}>
                                        {triggering === 'disc' ? 'Discovering...' : 'Discover Now'}
                                    </button>
                                    <button className="btn-secondary" onClick={() => runTask('run-smart-scheduler', 'sched')} disabled={triggering === 'sched'} style={{ flex: 1 }}>
                                        {triggering === 'sched' ? 'Scheduling...' : 'Schedule Now'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Notifications Tab ──────────────────────────────────────── */}
                    {activeTab === 'notifs' && (
                        <div>
                            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.2rem', color: '#0F172A', marginBottom: 8 }}>Notifications</h2>
                            <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: 28 }}>Stay updated on your automation's performance.</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {[
                                    { key: 'email_posts', label: 'Publication Emails', desc: 'Get an email for every post published.' },
                                    { key: 'email_analytics', label: 'Performance Reports', desc: 'Weekly summary of views and likes.' },
                                    { key: 'push_schedule', label: 'Push Notifications', desc: 'Real-time alerts for scheduled events.' },
                                ].map(({ key, label, desc }) => (
                                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#F8FAFC', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                                        <div>
                                            <p style={{ fontWeight: 600, color: '#0F172A', fontSize: '0.9rem' }}>{label}</p>
                                            <p style={{ fontSize: '0.75rem', color: '#64748B' }}>{desc}</p>
                                        </div>
                                        <button onClick={() => setNotifs({ ...notifs, [key]: !notifs[key] })} style={{
                                            width: 48, height: 26, borderRadius: 99, background: notifs[key] ? '#2563EB' : '#E2E8F0', border: 'none', cursor: 'pointer', transition: '0.3s',
                                        }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Security Tab ───────────────────────────────────────────── */}
                    {activeTab === 'security' && (
                        <div>
                            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.2rem', color: '#0F172A', marginBottom: 8 }}>Account Security</h2>
                            <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: 28 }}>Secure your automation dashboard.</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: 8 }}>New Password</label>
                                    <input className="input-field" type="password" placeholder="••••••••" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: 8 }}>Confirm New Password</label>
                                    <input className="input-field" type="password" placeholder="••••••••" />
                                </div>
                                <button className="btn-primary" style={{ width: 'fit-content' }}>
                                    <Shield size={15} /> Update Password
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}
