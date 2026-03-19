import { useState, useEffect } from 'react'
import { CalendarDays, Clock, Hash, Send, CheckCircle, Loader2 } from 'lucide-react'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { useLocation } from 'react-router-dom'

export default function Scheduler() {
    const location = useLocation()
    const params = new URLSearchParams(location.search)
    const [form, setForm] = useState({
        post_id: params.get('postId') ?? '',
        schedule_date: '',
        schedule_time: '09:00',
    })
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [scheduled, setScheduled] = useState([])
    const [scheduledLoading, setScheduledLoading] = useState(true)

    // Load real scheduled posts on mount
    useEffect(() => {
        api.get('/schedule/list')
            .then(({ data }) => setScheduled(data))
            .catch(() => setScheduled([]))
            .finally(() => setScheduledLoading(false))
    }, [])

    const handleSchedule = async (e) => {
        e.preventDefault()
        if (!form.post_id || !form.schedule_date) { toast.error('Please fill in all required fields'); return }
        setLoading(true)
        try {
            await api.post('/schedule/create', {
                post_id: Number(form.post_id),
                scheduled_time: `${form.schedule_date}T${form.schedule_time}:00`,
            })
            setSuccess(true)
            toast.success('Post scheduled successfully! 🗓️')
            // Refresh scheduled list
            const { data } = await api.get('/schedule/list')
            setScheduled(data)
            setTimeout(() => setSuccess(false), 4000)
        } catch (err) {
            toast.error(err.response?.data?.detail ?? 'Failed to schedule post')
        } finally {
            setLoading(false)
        }
    }

    const today = new Date().toISOString().split('T')[0]

    const formatScheduledTime = (iso) => {
        if (!iso) return { date: '—', time: '—' }
        const d = new Date(iso)
        return {
            date: d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 900 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} className="scheduler-grid">

                {/* Schedule Form */}
                <div className="card" style={{ padding: '28px' }}>
                    <div style={{ marginBottom: 24 }}>
                        <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.15rem', color: '#0F172A', marginBottom: 6 }}>
                            Schedule a Post
                        </h2>
                        <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
                            Pick the best date and time to maximize your LinkedIn reach.
                        </p>
                    </div>

                    <form onSubmit={handleSchedule} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {/* Post ID */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: 7 }}>
                                Post ID
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Hash size={16} color="#94A3B8" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    id="post-id-input"
                                    type="number"
                                    className="input-field"
                                    placeholder="e.g. 42"
                                    value={form.post_id}
                                    onChange={e => setForm({ ...form, post_id: e.target.value })}
                                    style={{ paddingLeft: 40 }}
                                />
                            </div>
                            <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: 5 }}>
                                Save a generated post first to get its ID.
                            </p>
                        </div>

                        {/* Date */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: 7 }}>
                                Schedule Date
                            </label>
                            <div style={{ position: 'relative' }}>
                                <CalendarDays size={16} color="#94A3B8" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    id="schedule-date"
                                    type="date"
                                    className="input-field"
                                    min={today}
                                    value={form.schedule_date}
                                    onChange={e => setForm({ ...form, schedule_date: e.target.value })}
                                    style={{ paddingLeft: 40 }}
                                />
                            </div>
                        </div>

                        {/* Time */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: 7 }}>
                                Schedule Time
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Clock size={16} color="#94A3B8" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    id="schedule-time"
                                    type="time"
                                    className="input-field"
                                    value={form.schedule_time}
                                    onChange={e => setForm({ ...form, schedule_time: e.target.value })}
                                    style={{ paddingLeft: 40 }}
                                />
                            </div>
                        </div>

                        {/* Best times tip */}
                        <div style={{ background: '#EFF6FF', borderRadius: 10, padding: '12px 16px', border: '1px solid #BFDBFE' }}>
                            <p style={{ fontSize: '0.8rem', color: '#1D4ED8', fontWeight: 500, marginBottom: 4 }}>💡 Best times to post</p>
                            <p style={{ fontSize: '0.78rem', color: '#3B82F6' }}>
                                Tues–Thurs: 7–9 AM, 12 PM, 5–6 PM (your audience's timezone)
                            </p>
                        </div>

                        <button id="schedule-btn" type="submit" className="btn-primary" disabled={loading}
                            style={{ width: '100%', justifyContent: 'center', padding: 12, opacity: loading ? 0.75 : 1 }}>
                            {success
                                ? <><CheckCircle size={16} /> Scheduled!</>
                                : loading
                                    ? 'Scheduling...'
                                    : <><Send size={16} /> Schedule Post</>
                            }
                        </button>
                    </form>
                </div>

                {/* Upcoming */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div className="card" style={{ padding: '24px' }}>
                        <h3 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#0F172A', marginBottom: 18 }}>
                            Upcoming Scheduled Posts
                        </h3>

                        {scheduledLoading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
                                <Loader2 size={24} color="#94A3B8" style={{ animation: 'spin 0.8s linear infinite' }} />
                            </div>
                        ) : scheduled.length === 0 ? (
                            <p style={{ color: '#94A3B8', fontSize: '0.875rem', textAlign: 'center', padding: '24px 0' }}>
                                No scheduled posts yet.
                            </p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {scheduled.map(post => {
                                    const { date, time } = formatScheduledTime(post.scheduled_time)
                                    return (
                                        <div key={post.id} style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            padding: '14px 16px', background: '#F8FAFC', borderRadius: 10,
                                            border: '1px solid #E2E8F0',
                                        }}>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0F172A', marginBottom: 4 }}>
                                                    #{post.post_id} · {post.topic || '(no preview)'}
                                                </div>
                                                <div style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                        <CalendarDays size={12} /> {date}
                                                    </span>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                        <Clock size={12} /> {time}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="badge badge-blue">{post.status}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* Content Calendar summary */}
                    <div className="card" style={{ padding: '24px', background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' }}>
                        <CalendarDays size={28} color="rgba(255,255,255,0.8)" style={{ marginBottom: 12 }} />
                        <h3 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1rem', color: 'white', marginBottom: 8 }}>
                            Content Calendar
                        </h3>
                        <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, marginBottom: 16 }}>
                            {scheduled.length > 0
                                ? <>You have <strong style={{ color: 'white' }}>{scheduled.length} post{scheduled.length !== 1 ? 's' : ''}</strong> scheduled. Consistency is key to LinkedIn growth!</>
                                : <>Schedule your first post to start building a consistent LinkedIn presence!</>
                            }
                        </p>
                        <div style={{ display: 'flex', gap: 8 }}>
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => {
                                // Highlight days that have actual scheduled posts
                                const today = new Date()
                                const dayOfWeek = today.getDay() // 0=Sun
                                const adjustedIndex = (i + 1) % 7 // Mon=0 → Sun=6 → JS: 1..7%7
                                const hasPost = scheduled.some(sp => {
                                    if (!sp.scheduled_time) return false
                                    const d = new Date(sp.scheduled_time)
                                    return d.getDay() === adjustedIndex
                                })
                                return (
                                    <div key={i} style={{
                                        width: 32, height: 32, borderRadius: 8,
                                        background: hasPost ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.15)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.75rem', fontWeight: 700,
                                        color: hasPost ? '#2563EB' : 'rgba(255,255,255,0.7)',
                                    }}>
                                        {d}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @media (max-width: 700px) { .scheduler-grid { grid-template-columns: 1fr !important; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
        </div>
    )
}
