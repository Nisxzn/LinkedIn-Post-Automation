import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

const pageTitles = {
    '/dashboard': 'Dashboard',
    '/dashboard/generate': 'Generate Post',
    '/dashboard/scheduler': 'Scheduler',
    '/dashboard/analytics': 'Analytics',
    '/dashboard/settings': 'Settings',
}

export default function DashboardLayout() {
    const { pathname } = useLocation()
    const [collapsed, setCollapsed] = useState(false)
    const title = pageTitles[pathname] ?? 'Dashboard'

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
            <div style={{ 
                marginLeft: collapsed ? '68px' : '260px', 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                minHeight: '100vh',
                transition: 'margin-left 0.2s ease-in-out'
            }}>
                <Navbar title={title} />
                <main style={{ flex: 1, position: 'relative', overflowY: 'auto' }} className="animate-fade-in">
                    {/* Background Decorations */}
                    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
                        <div style={{ position: 'absolute', top: -160, right: -160, width: 384, height: 384, background: 'rgba(37, 99, 235, 0.05)', borderRadius: '50%', filter: 'blur(64px)' }} />
                        <div style={{ position: 'absolute', bottom: -160, left: -160, width: 384, height: 384, background: 'rgba(34, 197, 94, 0.05)', borderRadius: '50%', filter: 'blur(64px)' }} />
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, height: 600, background: 'rgba(37, 99, 235, 0.03)', borderRadius: '50%', filter: 'blur(64px)' }} />
                    </div>

                    {/* Grid Pattern */}
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            opacity: 0.03,
                            pointerEvents: 'none',
                            zIndex: 0,
                            backgroundImage: 'linear-gradient(#0F172A 1px, transparent 1px), linear-gradient(90deg, #0F172A 1px, transparent 1px)',
                            backgroundSize: '40px 40px',
                            backgroundPosition: 'center top',
                        }}
                    />

                    {/* Content Container */}
                    <div style={{ position: 'relative', zIndex: 1, padding: '28px 32px' }}>
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}
