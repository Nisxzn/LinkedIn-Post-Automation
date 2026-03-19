import { useState } from 'react'
import { Sparkles, RefreshCw, Save, CalendarDays, Copy, Check, Send, Linkedin } from 'lucide-react'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function GeneratePost() {
    const { user } = useAuth()
    const [topic, setTopic] = useState('')
    const [postContent, setPostContent] = useState('')
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [posting, setPosting] = useState(false)
    const [copied, setCopied] = useState(false)
    const [postId, setPostId] = useState(null)

    // LinkedIn connection status from auth context (real data from login response)
    const linkedinConnected = user?.linkedin_connected ?? false

    const generatePost = async () => {
        if (!topic.trim()) { toast.error('Please enter a topic'); return }
        setLoading(true)
        try {
            const { data } = await api.post('/posts/generate', { topic })
            setPostContent(data.content ?? data.post ?? data.generated_text ?? JSON.stringify(data))
            setPostId(data.id ?? null)
            toast.success('Post generated!')
        } catch (err) {
            toast.error(err.response?.data?.detail ?? 'Failed to generate. Check if API is running.')
        } finally {
            setLoading(false)
        }
    }

    const savePost = async () => {
        if (!postContent) { toast.error('No post to save'); return }
        setSaving(true)
        try {
            const { data } = await api.post('/posts/save', { content: postContent, topic })
            setPostId(data.id ?? data.post_id ?? postId)
            toast.success('Post saved as draft!')
        } catch (err) {
            toast.error(err.response?.data?.detail ?? 'Failed to save post')
        } finally {
            setSaving(false)
        }
    }

    const postNow = async () => {
        if (!postContent) { toast.error('No post content to publish'); return }

        if (!linkedinConnected) {
            toast.error('Connect your LinkedIn account first in Settings → LinkedIn.')
            return
        }

        setPosting(true)
        try {
            const payload = { content: postContent, topic }
            if (postId) payload.post_id = postId
            const res = await api.post('/linkedin/post', payload)
            if (res.data?.post_id) setPostId(res.data.post_id)
            toast.success('🎉 Post published to LinkedIn successfully!')
        } catch (err) {
            let detail = err.response?.data?.detail ?? 'Failed to publish to LinkedIn.'
            if (typeof detail !== 'string') detail = 'Failed to publish. Invalid input or validation error.'
            toast.error(detail)
        } finally {
            setPosting(false)
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(postContent)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        toast.success('Copied to clipboard!')
    }

    const charCount = postContent.length
    const userName = user?.name ?? 'Your Name'
    const userInitial = userName[0].toUpperCase()

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 900 }}>

            {/* Input Card */}
            <div className="card" style={{ padding: '28px 28px' }}>
                <div style={{ marginBottom: 20 }}>
                    <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.15rem', color: '#0F172A', marginBottom: 6 }}>
                        Generate a LinkedIn Post
                    </h2>
                    <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
                        Enter a topic and our AI will craft a compelling, professional LinkedIn post for you.
                    </p>
                </div>

                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                    Topic / Keywords
                </label>
                <textarea
                    id="topic-input"
                    className="input-field"
                    rows={3}
                    placeholder="e.g. The future of AI agents in business, leadership lessons from startups, remote work productivity tips..."
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    style={{ resize: 'vertical', lineHeight: 1.6 }}
                />

                <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
                    <button id="generate-btn" className="btn-primary" onClick={generatePost} disabled={loading}
                        style={{ opacity: loading ? 0.75 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
                        {loading ? (
                            <RefreshCw size={16} style={{ animation: 'spin 0.8s linear infinite' }} />
                        ) : <Sparkles size={16} />}
                        {loading ? 'Generating...' : 'Generate Post'}
                    </button>

                    {postContent && (
                        <button className="btn-ghost" onClick={generatePost} disabled={loading}
                            style={{ opacity: loading ? 0.6 : 1 }}>
                            <RefreshCw size={15} /> Regenerate
                        </button>
                    )}
                </div>
            </div>

            {/* Output Card */}
            {(postContent || loading) && (
                <div className="card animate-fade-in" style={{ padding: '28px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h3 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#0F172A' }}>
                            Generated Post
                        </h3>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                            <span style={{ fontSize: '0.78rem', color: charCount > 3000 ? '#EF4444' : '#64748B' }}>
                                {charCount} / 3000 chars
                            </span>
                            <button className="btn-ghost" onClick={copyToClipboard} style={{ padding: '7px 14px', fontSize: '0.8rem' }}>
                                {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    </div>

                    {/* LinkedIn-style editor */}
                    <div style={{
                        background: '#F8FAFC', borderRadius: 12, border: '1.5px solid #E2E8F0',
                        padding: '20px', position: 'relative',
                    }}>
                        {/* LinkedIn post header with real user info */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: '50%',
                                background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white', fontWeight: 700, fontSize: '0.9rem',
                            }}>
                                {userInitial}
                            </div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0F172A' }}>
                                    {userName}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Your Network · Just now</div>
                            </div>
                        </div>
                        <textarea
                            id="post-editor"
                            value={postContent}
                            onChange={e => setPostContent(e.target.value)}
                            style={{
                                width: '100%', border: 'none', background: 'transparent', outline: 'none',
                                fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', lineHeight: 1.75,
                                color: '#1E293B', resize: 'vertical', minHeight: 200,
                            }}
                            placeholder="Your generated post will appear here..."
                        />
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
                        {/* Save Draft */}
                        <button id="save-draft-btn" className="btn-secondary" onClick={savePost} disabled={saving}
                            style={{ opacity: saving ? 0.75 : 1 }}>
                            <Save size={15} /> {saving ? 'Saving...' : 'Save Draft'}
                        </button>

                        {/* Schedule Post */}
                        <button className="btn-ghost" onClick={() => {
                            if (!postId) { toast.error('Please save the post first to get an ID'); return }
                            window.location.href = '/dashboard/scheduler?postId=' + postId
                        }}>
                            <CalendarDays size={15} /> Schedule Post
                        </button>

                        {/* Post Now to LinkedIn */}
                        <button
                            id="post-now-btn"
                            className="btn-primary"
                            onClick={postNow}
                            disabled={posting || !postContent}
                            style={{
                                opacity: (posting || !postContent) ? 0.75 : 1,
                                cursor: (posting || !postContent) ? 'not-allowed' : 'pointer',
                                background: linkedinConnected
                                    ? 'linear-gradient(135deg, #0077B5, #005885)'
                                    : 'linear-gradient(135deg, #94A3B8, #64748B)',
                            }}
                        >
                            {posting ? (
                                <RefreshCw size={15} style={{ animation: 'spin 0.8s linear infinite' }} />
                            ) : <Linkedin size={15} />}
                            {posting ? 'Publishing...' : 'Post Now'}
                        </button>
                    </div>

                    {/* LinkedIn not connected notice */}
                    {!linkedinConnected && (
                        <div style={{
                            marginTop: 12, padding: '10px 14px', borderRadius: 10,
                            background: '#FFF7ED', border: '1px solid #FED7AA',
                            fontSize: '0.8rem', color: '#92400E',
                        }}>
                            ⚠️ LinkedIn not connected. <a href="/dashboard/settings" style={{ color: '#D97706', fontWeight: 600 }}>Connect in Settings</a> to enable "Post Now".
                        </div>
                    )}

                    {postId && (
                        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span className="badge badge-green">Saved</span>
                            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Post ID: #{postId}</span>
                        </div>
                    )}
                </div>
            )}

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}
