import { NavLink } from 'react-router-dom'
import {
    LayoutDashboard, Sparkles, CalendarDays, BarChart3, Settings, LogOut, Linkedin,
    PanelLeftClose, PanelLeftOpen
} from 'lucide-react'
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
                background: '#18181B',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                left: 0,
                top: 0,
                zIndex: 40,
                borderRight: '1px solid #27272A',
                overflow: 'hidden'
            }}
        >
            {/* Logo */}
            <div style={{ padding: '16px', borderBottom: '1px solid #27272A', height: 64, display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 2px 8px rgba(37, 99, 235, 0.2)'
                    }}>
                        <Linkedin size={18} color="white" strokeWidth={2.5} />
                    </div>
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                            >
                                <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                                    LINKEDAI
                                </div>
                                <div style={{ fontSize: '10px', color: '#71717A', marginTop: -2, fontWeight: 500 }}>AI AUTOMATION</div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: '12px', display: 'flex', flexDirection: 'column', gap: 4, overflowX: 'hidden' }}>
                {!collapsed && <p style={{ padding: '8px 12px 6px', fontSize: '10px', fontWeight: 600, color: '#52525B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>MAIN MENU</p>}
                {navItems.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === '/dashboard'}
                        className="group relative"
                        style={({ isActive }) => ({
                            display: 'flex', alignItems: 'center', gap: 12,
                            padding: '10px 12px', borderRadius: 8,
                            textDecoration: 'none', fontSize: '13px', fontWeight: 500,
                            transition: 'all 0.15s ease',
                            background: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                            color: isActive ? '#FFFFFF' : '#A1A1AA',
                        })}
                        onMouseEnter={e => {
                            if (!e.currentTarget.classList.contains('active')) {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                e.currentTarget.style.color = '#FFFFFF';
                            }
                        }}
                        onMouseLeave={e => {
                            if (!e.currentTarget.getAttribute('aria-current')) {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = '#A1A1AA';
                            }
                        }}
                    >
                        {({ isActive }) => (
                            <>
                                <Icon size={18} strokeWidth={isActive ? 2 : 1.5} className="flex-shrink-0" />
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
            <div style={{ padding: '12px', borderTop: '1px solid #27272A' }}>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '10px 12px', borderRadius: 8, width: '100%',
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        fontSize: '13px', fontWeight: 500, color: '#A1A1AA',
                        transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.color = '#FFFFFF';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#A1A1AA';
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
                                style={{ fontWeight: 500 }}
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
                        fontSize: '13px', fontWeight: 500, color: '#EF4444',
                        transition: 'all 0.15s ease',
                    }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
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
