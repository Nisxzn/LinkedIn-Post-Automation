import { useState } from 'react'
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend, AreaChart, Area,
} from 'recharts'
import { Eye, ThumbsUp, MessageSquare, Share2, Search, TrendingUp, BarChart2, Hash } from 'lucide-react'
import api from '../api/axios'
import toast from 'react-hot-toast'

const emptyChart = [
    { date: 'Day 1', views: 0, likes: 0, comments: 0, shares: 0 },
    { date: 'Day 2', views: 0, likes: 0, comments: 0, shares: 0 },
    { date: 'Day 3', views: 0, likes: 0, comments: 0, shares: 0 },
    { date: 'Day 4', views: 0, likes: 0, comments: 0, shares: 0 },
    { date: 'Day 5', views: 0, likes: 0, comments: 0, shares: 0 },
]

const emptySummary = { views: 0, likes: 0, comments: 0, shares: 0 }

const metricCards = [
    { label: 'Total Views', key: 'views', icon: Eye, color: '#2563EB', bg: '#DBEAFE' },
    { label: 'Likes', key: 'likes', icon: ThumbsUp, color: '#7C3AED', bg: '#EDE9FE' },
    { label: 'Comments', key: 'comments', icon: MessageSquare, color: '#059669', bg: '#D1FAE5' },
    { label: 'Shares', key: 'shares', icon: Share2, color: '#D97706', bg: '#FEF3C7' },
]

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
        <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 10, padding: '12px 16px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
            <p style={{ fontWeight: 700, fontSize: '0.82rem', color: '#0F172A', marginBottom: 8 }}>{label}</p>
            {payload.map(p => (
                <p key={p.dataKey} style={{ fontSize: '0.8rem', color: p.color, margin: '3px 0' }}>
                    {p.name}: <strong>{p.value.toLocaleString()}</strong>
                </p>
            ))}
        </div>
    )
}

export default function Analytics() {
    const [postId, setPostId] = useState('')
    const [analyticsData, setAnalyticsData] = useState(null)   // null = not loaded yet
    const [summary, setSummary] = useState(emptySummary)
    const [loading, setLoading] = useState(false)
    const [loaded, setLoaded] = useState(false)

    const fetchAnalytics = async () => {
        if (!postId.trim()) { toast.error('Enter a Post ID or URL'); return }
        setLoading(true)
        try {
            const { data } = await api.get(`/analytics/post/${encodeURIComponent(postId)}`)
            const chartData = data.chart_data ?? emptyChart
            setAnalyticsData(chartData)
            setSummary({
                views: data.total_views ?? 0,
                likes: data.likes ?? 0,
                comments: data.comments ?? 0,
                shares: data.shares ?? 0,
            })
            setLoaded(true)
            toast.success('Analytics loaded!')
        } catch (err) {
            toast.error(err.response?.data?.detail ?? 'Failed to load analytics.')
            setAnalyticsData(null)
            setLoaded(false)
        } finally {
            setLoading(false)
        }
    }

    const chartData = analyticsData ?? emptyChart

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Header + Fetch */}
            <div className="card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <TrendingUp size={20} color="#2563EB" />
                <div style={{ flex: 1 }}>
                    <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#0F172A' }}>
                        Post Analytics
                    </h2>
                    <p style={{ fontSize: '0.8rem', color: '#64748B' }}>Enter a Post ID or LinkedIn Post URL to load real analytics data.</p>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <HashIcon size={15} color="#94A3B8" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            id="analytics-post-id"
                            type="text"
                            className="input-field"
                            placeholder="Post ID or URL"
                            value={postId}
                            onChange={e => setPostId(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && fetchAnalytics()}
                            style={{ width: 220, paddingLeft: 34 }}
                        />
                    </div>
                    <button className="btn-primary" onClick={fetchAnalytics} disabled={loading} style={{ padding: '10px 18px', opacity: loading ? 0.75 : 1 }}>
                        <Search size={15} /> {loading ? 'Loading...' : 'Load'}
                    </button>
                </div>
            </div>

            {/* Empty state — before any data is loaded */}
            {!loaded && !loading && (
                <div className="card" style={{ padding: '60px 24px', textAlign: 'center' }}>
                    <BarChart2 size={40} color="#CBD5E1" style={{ marginBottom: 16 }} />
                    <h3 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#94A3B8', marginBottom: 8 }}>
                        No data loaded yet
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#CBD5E1' }}>
                        Enter a Post ID or URL above and click &ldquo;Load&rdquo; to view real analytics.
                    </p>
                </div>
            )}

            {/* Metric Summary Cards — shown only after loading */}
            {loaded && (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                        {metricCards.map(({ label, key, icon: Icon, color, bg }) => (
                            <div key={key} className="card" style={{ padding: '20px 22px', display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Icon size={20} color={color} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
                                    <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
                                        {summary[key]?.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Area Chart — Views */}
                    <div className="card" style={{ padding: '24px' }}>
                        <h3 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#0F172A', marginBottom: 20 }}>
                            Views Over Time
                        </h3>
                        <ResponsiveContainer width="100%" height={240}>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="views" name="Views" stroke="#2563EB" strokeWidth={2.5} fill="url(#viewsGrad)" dot={{ r: 4, fill: '#2563EB', strokeWidth: 0 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Bar Chart — Engagement */}
                    <div className="card" style={{ padding: '24px' }}>
                        <h3 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#0F172A', marginBottom: 20 }}>
                            Engagement Breakdown
                        </h3>
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart data={chartData} barGap={4}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ fontSize: '0.8rem', paddingTop: 12 }} />
                                <Bar dataKey="likes" name="Likes" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="comments" name="Comments" fill="#059669" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="shares" name="Shares" fill="#D97706" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </>
            )}
        </div>
    )
}

function HashIcon({ size = 16, color = '#94A3B8', style }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" /><line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" /></svg>
}
