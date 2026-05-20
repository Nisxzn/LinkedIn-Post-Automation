import { NavLink } from 'react-router-dom'
import {
    LayoutDashboard, Sparkles, CalendarDays, BarChart3, Settings, LogOut,
    PanelLeftClose, PanelLeftOpen
} from 'lucide-react'
import LinkedInIcon from '../common/LinkedInIcon'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'

const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/dashboard/generate', icon: Sparkles, label: 'Generate Post' },
    { to: '/dashboard/scheduler', icon: CalendarDays, label: 'Scheduler' },
    { to: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar({ collapsed, setCollapsed }) {
    const { logout } = useAuth()

    return (
        <motion.aside
            animate={{ width: collapsed ? 68 : 260 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="sidebar"
            style={{
                height: '100vh',
                background: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                left: 0,
                top: 0,
                zIndex: 40,
                borderRight: '1px solid #F1F5F9',
                overflow: 'hidden'
            }}
        >
            {/* Logo */}
            <div style={{ padding: '16px', borderBottom: '1px solid #F1F5F9', height: 64, display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <LinkedInIcon size={32} />
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                            >
                                <div style={{ fontFamily: "'MADE Okine Sans PERSONAL USE', 'Space Grotesk', 'Outfit', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: '#0F172A', letterSpacing: '0.02em' }}>
                                    POSTLY-AI
                                </div>
                                <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: -2, fontWeight: 600, letterSpacing: '0.05em' }}>AI AUTOMATION</div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: '12px', display: 'flex', flexDirection: 'column', gap: 4, overflowX: 'hidden' }}>
                {!collapsed && <p style={{ padding: '8px 12px 6px', fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>MAIN MENU</p>}
                {navItems.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === '/dashboard'}
                        className="group relative"
                        style={({ isActive }) => ({
                            display: 'flex', alignItems: 'center', gap: 12,
                            padding: '10px 12px', borderRadius: 8,
                            textDecoration: 'none', fontSize: '13px', fontWeight: 600,
                            transition: 'all 0.15s ease',
                            background: isActive ? 'rgba(37, 99, 235, 0.06)' : 'transparent',
                            color: isActive ? '#2563EB' : '#64748B',
                        })}
                        onMouseEnter={e => {
                            if (!e.currentTarget.classList.contains('active')) {
                                e.currentTarget.style.background = '#F8FAFC';
                                e.currentTarget.style.color = '#0F172A';
                            }
                        }}
                        onMouseLeave={e => {
                            if (!e.currentTarget.getAttribute('aria-current')) {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = '#64748B';
                            }
                        }}
                    >
                        {({ isActive }) => (
                            <>
                                <Icon size={18} strokeWidth={isActive ? 2 : 1.5} className="flex-shrink-0" style={{ color: isActive ? '#2563EB' : '#94A3B8' }} />
                                <AnimatePresence>
                                    {!collapsed && (
                                        <motion.span
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: 'auto' }}
                                            exit={{ opacity: 0, width: 0 }}
                                            transition={{ duration: 0.2 }}
                                            style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                                        >
                                            {label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div style={{ padding: '12px', borderTop: '1px solid #F1F5F9' }}>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '10px 12px', borderRadius: 8, width: '100%',
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        fontSize: '13px', fontWeight: 600, color: '#64748B',
                        transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = '#F8FAFC';
                        e.currentTarget.style.color = '#0F172A';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#64748B';
                    }}
                    title={collapsed ? 'Expand' : 'Collapse'}
                >
                    {collapsed ? <PanelLeftOpen size={18} strokeWidth={1.5} /> : <PanelLeftClose size={18} strokeWidth={1.5} />}
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                className="overflow-hidden whitespace-nowrap"
                                style={{ fontWeight: 600 }}
                            >
                                Collapse Sidebar
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>

                <div style={{ marginTop: 8 }}>
                    <button onClick={logout} style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '10px 12px', borderRadius: 8, width: '100%',
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        fontSize: '13px', fontWeight: 600, color: '#EF4444',
                        transition: 'all 0.15s ease',
                    }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.06)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                        <LogOut size={18} />
                        <AnimatePresence>
                            {!collapsed && (
                                <motion.span
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: 'auto' }}
                                    exit={{ opacity: 0, width: 0 }}
                                    className="overflow-hidden whitespace-nowrap"
                                >
                                    Logout
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </div>
        </motion.aside>
    )
}
