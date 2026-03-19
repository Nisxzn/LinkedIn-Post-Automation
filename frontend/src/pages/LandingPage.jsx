import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles, CalendarDays, BarChart3, CheckCircle, Linkedin, Zap, Shield, Clock } from 'lucide-react'

const features = [
    { icon: Sparkles, title: 'AI-Powered Writing', desc: 'Generate compelling LinkedIn posts instantly using advanced AI trained on top-performing content.' },
    { icon: CalendarDays, title: 'Smart Scheduling', desc: 'Schedule your posts at optimal times for maximum reach and engagement with your audience.' },
    { icon: BarChart3, title: 'Deep Analytics', desc: 'Track views, likes, comments and shares with beautiful real-time analytics dashboards.' },
    { icon: Shield, title: 'Secure & Private', desc: 'Enterprise-grade security with end-to-end encryption. Your data stays yours, always.' },
    { icon: Zap, title: 'Lightning Fast', desc: 'Generate posts in under 3 seconds. No waiting, no friction — just pure productivity.' },
    { icon: Clock, title: 'Save 10+ Hours/Week', desc: 'Automate your entire LinkedIn content workflow and reclaim time for what matters most.' },
]

const steps = [
    { num: '01', title: 'Enter a Topic', desc: 'Simply type a topic or keyword and let our AI understand the context.' },
    { num: '02', title: 'AI Generates Post', desc: 'Our model crafts a professional, engaging LinkedIn post tailored to your brand.' },
    { num: '03', title: 'Schedule & Publish', desc: 'Pick the best time to post and let us handle the publishing automatically.' },
]


export default function LandingPage() {
    const navigate = useNavigate()

    return (
        <div style={{ minHeight: '100vh', background: '#FAFBFF', fontFamily: 'Inter, sans-serif' }}>
            {/* Nav */}
            <nav style={{
                position: 'sticky', top: 0, background: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(16px)', borderBottom: '1px solid #F1F5F9',
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, height: 64
            }}>
                <div style={{ width: '100%', maxWidth: 1160, padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: '#2563EB',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Linkedin size={18} color="white" />
                        </div>
                        <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '1rem', color: '#0F172A' }}>
                            LinkedAI
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button className="btn-ghost" onClick={() => navigate('/login?mode=login')} style={{ height: 38, padding: '0 20px', fontSize: '0.85rem' }}>Login</button>
                        <button className="btn-primary" onClick={() => navigate('/login?mode=signup')} style={{ height: 38, padding: '0 20px', fontSize: '0.85rem' }}>
                            Sign Up
                        </button>
                    </div>
                </div>
            </nav>

            <section style={{
                padding: '120px 24px 100px', textAlign: 'center',
                background: 'linear-gradient(180deg, #F8FAFF 0%, #FFFFFF 100%)',
            }}>
                <div style={{ maxWidth: 800, margin: '0 auto' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        background: '#FFFFFF', borderRadius: 999, padding: '8px 18px',
                        marginBottom: 32, color: '#2563EB', fontSize: '0.8rem', fontWeight: 700,
                        boxShadow: '0 4px 15px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9',
                    }}>
                        <Sparkles size={14} fill="#2563EB" /> AI-Powered LinkedIn Automation
                    </div>
                    <h1 style={{
                        fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 'clamp(2.2rem, 6vw, 3.8rem)',
                        fontWeight: 800, color: '#111827', lineHeight: 1, marginBottom: 28,
                        letterSpacing: '-0.04em',
                    }}>
                        Automate Your LinkedIn<br />
                        <span style={{
                            background: 'linear-gradient(90deg, #4F46E5, #9333EA)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            Content with AI
                        </span>
                    </h1>
                    <p style={{
                        fontSize: '1.05rem', color: '#4B5563', maxWidth: 660, margin: '0 auto 44px', lineHeight: 1.6,
                    }}>
                        Let our AI generate, Schedule, and Optimize your content so you can focus on building meaningful connections.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button className="btn-primary" onClick={() => navigate('/login?mode=signup')} style={{ height: 48, padding: '0 35px', fontSize: '1rem', background: '#2563EB', boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}>
                            Get Started Free
                        </button>
                    </div>
                </div>
            </section>

            <section id="features" style={{ padding: '100px 32px', background: 'white' }}>
                <div style={{ maxWidth: 1160, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 48 }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>FEATURES</div>
                        <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#0F172A', marginBottom: 12 }}>
                            Everything you need to dominate LinkedIn
                        </h2>
                        <p style={{ color: '#64748B', maxWidth: 480, margin: '0 auto', fontSize: '0.95rem', lineHeight: 1.6 }}>
                            A complete toolkit built for professionals building their personal brand.
                        </p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                        {features.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="card" style={{ padding: '28px 24px' }}>
                                <div style={{
                                    width: 44, height: 44, borderRadius: '50%',
                                    background: '#F0F7FF',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
                                }}>
                                    <Icon size={20} color="#2563EB" />
                                </div>
                                <h3 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>{title}</h3>
                                <p style={{ color: '#64748B', fontSize: '0.85rem', lineHeight: 1.6 }}>{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="how" style={{ padding: '100px 32px', background: '#F9FBFF' }}>
                <div style={{ maxWidth: 1160, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 48 }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>HOW IT WORKS</div>
                        <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#0F172A' }}>
                            From idea to published in 60 seconds
                        </h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 28 }}>
                        {steps.map(({ num, title, desc }) => (
                            <div key={num} style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: 52, height: 52, borderRadius: '50%',
                                    background: '#2563EB',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 20px',
                                    fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '1rem', color: 'white',
                                }}>
                                    {num}
                                </div>
                                <h3 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#0F172A', marginBottom: 10 }}>{title}</h3>
                                <p style={{ color: '#64748B', fontSize: '0.85rem', lineHeight: 1.6 }}>{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ background: '#FFFFFF', padding: '80px 32px 40px', color: '#0F172A', borderTop: '1px solid #F1F5F9' }}>
                <div style={{ maxWidth: 1160, margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 40 }}>
                        {/* Brand Column */}
                        <div style={{ gridColumn: 'span 2' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: 8,
                                    background: '#2563EB',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Linkedin size={16} color="white" />
                                </div>
                                <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em', color: '#0F172A' }}>
                                    LinkedAI
                                </span>
                            </div>
                            <p style={{ color: '#64748B', fontSize: '0.85rem', lineHeight: 1.6, maxWidth: 300 }}>
                                Automating LinkedIn success with precision AI.
                            </p>
                        </div>

                        {/* Links Columns */}
                        <div>
                            <h4 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#0F172A', marginBottom: 16 }}>Product</h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {['Generator', 'Schedule', 'Analytics'].map(link => (
                                    <li key={link}><a href="#" style={{ color: '#64748B', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}>{link}</a></li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#0F172A', marginBottom: 16 }}>Legal</h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {['Privacy', 'Terms', 'Security'].map(link => (
                                    <li key={link}><a href="#" style={{ color: '#64748B', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}>{link}</a></li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div style={{
                        paddingTop: 30,
                        borderTop: '1px solid #F1F5F9',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 16
                    }}>
                        <p style={{ color: '#94A3B8', fontSize: '0.8rem' }}>
                            © 2026 LinkedAI. All rights reserved.
                        </p>
                        <div style={{ display: 'flex', gap: 20 }}>
                            {[Linkedin, Zap, Shield].map((Icon, i) => (
                                <Icon key={i} size={16} color="#94A3B8" style={{ cursor: 'pointer' }} />
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
