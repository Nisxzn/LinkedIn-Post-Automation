import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Layers,
    Zap,
    Compass,
    ArrowUpRight,
    History,
    MoreHorizontal,
    PenTool,
    LineChart,
    Calendar,
    Sparkles,
    Trash2,
    Eye,
    ThumbsUp,
    Shield
} from 'lucide-react'
import { motion } from 'framer-motion'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const statCards = [
    { label: 'Total Content Generated', key: 'total_posts', icon: Layers, color: '#0F172A', bg: 'rgba(15, 23, 42, 0.05)' },
    { label: 'Pipeline Schedule', key: 'scheduled', icon: Calendar, color: '#0F172A', bg: 'rgba(15, 23, 42, 0.05)' },
    { label: 'Monthly Growth', key: 'this_month', icon: Zap, color: '#0F172A', bg: 'rgba(15, 23, 42, 0.05)' },
]

const statusBadge = (s) => {
    const map = { published: 'badge-green', scheduled: 'badge-blue', draft: 'badge-amber', posted: 'badge-green' }
    const label = s.charAt(0).toUpperCase() + s.slice(1)
    return <span className={`badge ${map[s?.toLowerCase()] ?? 'badge-blue'}`}>{label}</span>
}

export default function Dashboard() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [stats, setStats] = useState(null)
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const { data: dash } = await api.get('/posts/dashboard')
                setStats(dash.stats)
                setPosts(dash.recent_posts ?? [])
            } catch {
                // axios interceptor handles 401; other errors leave stats null
            } finally {
                setLoading(false)
            }
        }
        fetchDashboard()
    }, [])

    const handleDelete = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post? If published, it will be removed from LinkedIn as well.")) return
        try {
            await api.delete(`/posts/${postId}`)
            setPosts(posts.filter(p => p.id !== postId))
            toast.success("Post deleted successfully")
        } catch (err) {
            toast.error(err.response?.data?.detail ?? "Failed to delete post")
        }
    }

    const greeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Good morning'
        if (hour < 17) return 'Good afternoon'
        return 'Good evening'
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* Welcome row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div>
                        <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '1.4rem', color: '#0F172A' }}>
                            {greeting()}, {user?.name ?? ''}!
                        </h2>
                        <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: 4 }}>
                            Here's what's happening with your LinkedIn account today.
                        </p>
                    </div>
                </div>
                <button className="btn-primary" id="new-post-btn" onClick={() => navigate('/dashboard/generate')}>
                    <Sparkles size={16} /> Generate New Post
                </button>
            </div>

            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
                {statCards.map(({ label, key, icon: Icon, color, bg }) => (
                    <div key={key} className="card" style={{ padding: '22px 24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                                    {label}
                                </p>
                                <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '2rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>
                                    {loading ? '—' : (stats?.[key] ?? 0)}
                                </p>
                            </div>
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                                style={{
                                    width: 44, height: 44, borderRadius: 12, background: bg,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                }}
                            >
                                <Icon size={20} color={color} strokeWidth={2.2} />
                            </motion.div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                {[
                    { label: 'Creative Forge', icon: PenTool, to: '/dashboard/generate', color: '#2563EB', bg: 'rgba(37, 99, 235, 0.08)' },
                    { label: 'Strategic Plan', icon: Compass, to: '/dashboard/scheduler', color: '#7C3AED', bg: 'rgba(124, 58, 237, 0.08)' },
                    { label: 'Growth Insights', icon: LineChart, to: '/dashboard/analytics', color: '#059669', bg: 'rgba(5, 150, 105, 0.08)' },
                ].map(({ label, icon: Icon, to, color, bg }) => (
                    <motion.div
                        key={label}
                        className="card"
                        onClick={() => navigate(to)}
                        whileHover={{ y: -4 }}
                        style={{ padding: '18px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}
                    >
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon size={18} color={color} strokeWidth={2.2} />
                        </div>
                        <div>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0F172A' }}>{label}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                                <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 500 }}>Access Module</span>
                                <ArrowUpRight size={12} color="#94A3B8" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Recent Posts Table */}
            <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563EB' }} />
                        <h3 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#0F172A' }}>
                            Recent Transactions
                        </h3>
                    </div>
                    <button className="btn-ghost" onClick={() => navigate('/dashboard/analytics')} style={{ padding: '7px 14px', fontSize: '0.8rem', borderRadius: 8 }}>
                        History <History size={13} style={{ marginLeft: 6 }} />
                    </button>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                            <MoreHorizontal size={24} color="#CBD5E1" />
                        </motion.div>
                    </div>
                ) : posts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px 0' }}>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <Shield size={40} color="#F1F5F9" strokeWidth={1} style={{ marginBottom: 16 }} />
                            <p style={{ color: '#94A3B8', fontSize: '0.875rem', marginBottom: 20 }}>Database clear. No active records found.</p>
                            <button className="btn-primary" onClick={() => navigate('/dashboard/generate')} style={{ fontSize: '0.85rem', padding: '8px 18px' }}>
                                <PenTool size={14} style={{ marginRight: 8 }} /> Generate Post
                            </button>
                        </motion.div>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="data-table">
                            <thead>
                                <tr style={{ background: 'rgba(15, 23, 42, 0.02)' }}>
                                    <th style={{ paddingLeft: 20 }}>Reference</th>
                                    <th>Classification</th>
                                    <th>Status</th>
                                    <th><Eye size={13} strokeWidth={2.5} /> Reach</th>
                                    <th><ThumbsUp size={13} strokeWidth={2.5} /> Impact</th>
                                    <th>Timestamp</th>
                                    <th style={{ textAlign: 'right', paddingRight: 20 }}>Operations</th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts.map(post => (
                                    <motion.tr
                                        key={post.id}
                                        whileHover={{ background: 'rgba(15, 23, 42, 0.01)' }}
                                    >
                                        <td style={{ color: '#94A3B8', fontWeight: 600, paddingLeft: 20 }}>ID-{post.id}</td>
                                        <td style={{ fontWeight: 600, color: '#1E293B', maxWidth: 280 }}>{post.topic}</td>
                                        <td>{statusBadge(post.status)}</td>
                                        <td>{post.status === 'published' || post.status === 'posted' ? 'Active' : 'Pending'}</td>
                                        <td>{post.status === 'published' || post.status === 'posted' ? 'Active' : 'Pending'}</td>
                                        <td style={{ color: '#64748B', fontSize: '0.75rem' }}>{post.created_at}</td>
                                        <td style={{ textAlign: 'right', paddingRight: 20 }}>
                                            <motion.button
                                                whileHover={{ scale: 1.1, color: '#EF4444' }}
                                                onClick={() => handleDelete(post.id)}
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    color: '#94A3B8',
                                                    padding: '6px'
                                                }}
                                                title="Terminate Record"
                                            >
                                                <Trash2 size={16} />
                                            </motion.button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
