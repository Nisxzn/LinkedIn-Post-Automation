import { useState, useEffect } from 'react'
import { Bell, ChevronDown, User, LogOut, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

export default function Navbar({ title }) {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [autoActive, setAutoActive] = useState(null)
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const { data } = await api.get('/automation/settings')
                setAutoActive(data.is_active === 1)
            } catch (err) {
                console.error("Failed to fetch automation status")
            }
        }

        fetchStatus()
        const interval = setInterval(fetchStatus, 3000) // Poll every 3 seconds

        return () => clearInterval(interval)
    }, [])

    const initial = (user?.name ?? 'U')[0].toUpperCase()
    const displayName = user?.name ?? 'User'

    return (
        <header style={{
            height: 64, background: '#FFFFFF',
            borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center',
            padding: '0 28px', gap: 16,
            position: 'sticky', top: 0, zIndex: 30,
            boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
        }}>
            {/* Page title */}
            <div style={{ flex: 1 }}>
                <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>
                    {title}
                </h1>
            </div>

            {/* Automation Status */}
            <div style={{ marginRight: 8 }}>
                {autoActive !== null && (
                    <div style={{
                        padding: '5px 10px', borderRadius: 8, fontSize: '0.65rem', fontWeight: 700,
                        display: 'flex', alignItems: 'center', gap: 6,
                        background: autoActive ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                        color: autoActive ? '#15803D' : '#B91C1C',
                        border: `1px solid ${autoActive ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)'}`,
                        userSelect: 'none'
                    }}>
                        <div style={{
                            width: 6, height: 6, borderRadius: '50%',
                            background: autoActive ? '#22C55E' : '#EF4444',
                            boxShadow: autoActive ? '0 0 8px rgba(34, 197, 94, 0.4)' : 'none'
                        }}></div>
                        <span style={{ letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                            {autoActive ? 'Automation: ON' : 'Automation: OFF'}
                        </span>
                    </div>
                )}
            </div>

            {/* Bell */}
            <button style={{
                width: 38, height: 38, borderRadius: 10, border: '1.5px solid var(--border)',
                background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#64748B', position: 'relative', transition: 'all 0.15s',
            }}
                onMouseEnter={e => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.color = '#2563EB' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.color = '#64748B' }}
            >
                <Bell size={17} />
            </button>

            {/* User dropdown */}
            <div style={{ position: 'relative' }}>
                <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        background: '#FFFFFF', border: '1.5px solid var(--border)',
                        borderRadius: 10, padding: '6px 12px', cursor: 'pointer',
                        transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                    onMouseLeave={e => e.currentTarget.style.background = '#FFFFFF'}
                >
                    <div style={{
                        width: 28, height: 28, borderRadius: 8,
                        background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontWeight: 700, fontSize: '0.8rem',
                    }}>
                        {initial}
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0F172A' }}>{displayName}</span>
                    <ChevronDown size={14} color="#64748B" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                </button>

                {dropdownOpen && (
                    <div style={{
                        position: 'absolute', right: 0, top: 48,
                        background: '#FFFFFF', borderRadius: 12, border: '1px solid var(--border)',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.05)', minWidth: 180, zIndex: 50,
                        overflow: 'hidden',
                    }}>
                        {/* User info header */}
                        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: '#F8FAFC' }}>
                            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>{displayName}</p>
                            <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: 2 }}>{user?.email ?? ''}</p>
                        </div>
                        {[
                            { icon: Settings, label: 'Settings', action: () => navigate('/dashboard/settings') },
                            { icon: LogOut, label: 'Logout', action: logout, danger: true },
                        ].map(({ icon: Icon, label, action, danger }) => (
                            <button key={label} onClick={() => { action(); setDropdownOpen(false) }} style={{
                                display: 'flex', alignItems: 'center', gap: 10,
                                padding: '11px 16px', width: '100%', background: 'transparent',
                                border: 'none', cursor: 'pointer', fontSize: '0.875rem',
                                fontWeight: 500, color: danger ? '#EF4444' : '#374151',
                                transition: 'background 0.15s',
                                fontFamily: 'Inter, sans-serif',
                            }}
                                onMouseEnter={e => e.currentTarget.style.background = danger ? '#FEE2E2' : '#F8FAFC'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                <Icon size={15} />
                                {label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </header>
    )
}
