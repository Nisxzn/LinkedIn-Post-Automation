import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles, CalendarDays, BarChart3, CheckCircle, Zap, Shield, Clock } from 'lucide-react'
import LinkedInIcon from '../components/common/LinkedInIcon'

const features = [
    { icon: Sparkles, title: 'AI-Powered Writing', desc: 'Generate compelling LinkedIn posts instantly using advanced AI trained on top-performing content.' },
    { icon: CalendarDays, title: 'Smart Scheduling', desc: 'Schedule your posts at optimal times for maximum reach and engagement with your audience.' },
    { icon: BarChart3, title: 'Deep Analytics', desc: 'Track views, likes, comments and shares with beautiful real-time analytics dashboards.' },
    { icon: Shield, title: 'Secure & Private', desc: 'Enterprise-grade security with end-to-end encryption. Your data stays yours, always.' },
    { icon: Zap, title: 'Lightning Fast', desc: 'Generate posts in under 3 seconds. No waiting, no friction — just pure productivity.' },
    { icon: Clock, title: 'Save 10+ Hours/Week', desc: 'Automate your entire LinkedIn content workflow and reclaim time for what matters most.' },
]

const steps = [
    { title: 'Enter a Topic', desc: 'Type a topic or keyword and let our AI understand the context.' },
    { title: 'AI Generates Post', desc: 'Our model crafts a professional, engaging post tailored to your brand.' },
    { title: 'Schedule & Publish', desc: 'Pick the best time and let us handle the publishing automatically.' },
]


export default function LandingPage() {
    const navigate = useNavigate()
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <>
            <style>{`
                @keyframes smoothBg {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animated-wrapper {
                    background: linear-gradient(-45deg, #ffffff, #f4f8ff, #ebf4ff, #ffffff);
                    background-size: 400% 400%;
                    animation: smoothBg 15s ease infinite;
                }
            `}</style>
            <div className="animated-wrapper" style={{ minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
                {/* Dynamic Island Navbar */}
                <div style={{
                    position: 'fixed', top: isScrolled ? 14 : 0, left: 0, right: 0,
                    display: 'flex', justifyContent: 'center', zIndex: 100,
                    padding: isScrolled ? '0 24px' : '0',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                }}>
                    <nav style={{
                        width: '100%',
                        maxWidth: isScrolled ? 580 : '100%',
                        height: 60,
                        background: isScrolled ? 'rgba(255,255,255,0.82)' : 'transparent',
                        backdropFilter: isScrolled ? 'blur(20px) saturate(180%)' : 'none',
                        borderRadius: isScrolled ? 999 : 0,
                        border: 'none',
                        boxShadow: isScrolled ? '0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)' : 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}>
                        <div style={{
                            width: '100%', maxWidth: isScrolled ? 560 : 1160,
                            padding: '0 32px',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}>
                            <span style={{
                                fontFamily: "'MADE Okine Sans PERSONAL USE', 'Space Grotesk', 'Outfit', sans-serif", fontWeight: 700,
                                fontSize: '1.15rem', color: '#0F172A',
                                letterSpacing: '0.02em',
                            }}>
                                <a href="#" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <LinkedInIcon size={25} />
                                    POSTLY-AI
                                </a>
                            </span>
                            <div style={{ display: 'flex', gap: 10 }}>
                                <button className="btn-ghost" onClick={() => navigate('/login?mode=login')} style={{
                                    height: 38, padding: '0 20px', fontSize: '0.85rem',
                                }}>Login</button>
                                <button className="btn-primary" onClick={() => navigate('/login?mode=signup')} style={{
                                    height: 38, padding: '0 20px', fontSize: '0.85rem',
                                }}>
                                    Sign Up
                                </button>
                            </div>
                        </div>
                    </nav>
                </div>

                <section style={{
                    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '0 24px', textAlign: 'center',
                    background: 'transparent',
                }}>
                    <div style={{ maxWidth: 800, margin: '0 auto' }}>
                        <h1 style={{ marginBottom: 28, lineHeight: 1.1 }}>
                            <span style={{
                                fontFamily: '"Oswald", sans-serif', fontSize: 'clamp(2.4rem, 6vw, 4rem)',
                                fontWeight: 800, color: '#111827',
                                letterSpacing: '-0.02em', textTransform: 'uppercase',
                                display: 'block',
                            }}>
                                Automate Your LinkedIn
                            </span>
                            <span style={{
                                fontFamily: '"Merriweather", serif', fontSize: 'clamp(1.7rem, 5vw, 3.2rem)',
                                fontWeight: 700,
                                background: 'linear-gradient(90deg, #4F46E5, #9333EA)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                display: 'block', marginTop: 8,
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

                <section id="features" style={{ padding: '120px 32px', background: 'transparent', marginTop: '-190px' }}>
                    <div style={{ maxWidth: 960, margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: 64 }}>
                            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, color: '#0F172A', marginBottom: 14 }}>
                                Everything you need
                            </h2>
                            <p style={{ color: '#94A3B8', maxWidth: 420, margin: '0 auto', fontSize: '0.9rem', lineHeight: 1.7 }}>
                                A complete toolkit for professionals building their personal brand.
                            </p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
                            {features.map(({ icon: Icon, title, desc }, i) => (
                                <div key={title} style={{
                                    padding: '40px 32px', borderRadius: 24,
                                    background: 'linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)',
                                    border: '1px solid #F1F5F9',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                                    position: 'relative', overflow: 'hidden',
                                    transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                                    cursor: 'default',
                                }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = 'translateY(-6px)';
                                        e.currentTarget.style.boxShadow = '0 30px 60px rgba(37,99,235,0.08), 0 4px 12px rgba(0,0,0,0.03)';
                                        e.currentTarget.style.borderColor = '#E2E8F0';
                                        e.currentTarget.style.background = 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFF 100%)';
                                        e.currentTarget.querySelector('.icon-wrap').style.transform = 'scale(1.1)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.02)';
                                        e.currentTarget.style.borderColor = '#F1F5F9';
                                        e.currentTarget.style.background = 'linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)';
                                        e.currentTarget.querySelector('.icon-wrap').style.transform = 'scale(1)';
                                    }}
                                >
                                    <div className="icon-wrap" style={{
                                        width: 48, height: 48, borderRadius: 14,
                                        background: 'rgba(37,99,235,0.04)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        marginBottom: 24,
                                        border: '1px solid rgba(37,99,235,0.08)',
                                        transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                                    }}>
                                        <Icon size={22} color="#2563EB" strokeWidth={1.5} />
                                    </div>
                                    <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0F172A', marginBottom: 12, letterSpacing: '-0.01em' }}>{title}</h3>
                                    <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>{desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="how" style={{ padding: '120px 32px', background: 'transparent' }}>
                    <div style={{ maxWidth: 760, margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: 64 }}>
                            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, color: '#0F172A', marginBottom: 14 }}>
                                How it works
                            </h2>
                            <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>From idea to published in 60 seconds.</p>
                        </div>
                        {/* Flow steps with connecting line */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative' }}>
                            {/* Horizontal flow line */}
                            <div style={{
                                position: 'absolute', top: 6, left: '16.66%', right: '16.66%',
                                height: 1, background: 'linear-gradient(90deg, #E2E8F0, #CBD5E1, #E2E8F0)',
                            }} />
                            {steps.map(({ title, desc }, i) => (
                                <div key={i} style={{ flex: 1, textAlign: 'center', position: 'relative', padding: '0 16px' }}>
                                    {/* Dot */}
                                    <div style={{
                                        width: 12, height: 12, borderRadius: '50%',
                                        background: '#2563EB', border: '3px solid #EEF2FF',
                                        margin: '0 auto 24px', position: 'relative', zIndex: 1,
                                    }} />
                                    <h3 style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0F172A', marginBottom: 8 }}>{title}</h3>
                                    <p style={{ color: '#94A3B8', fontSize: '0.8rem', lineHeight: 1.6 }}>{desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer style={{ background: '#FFFFFF', padding: '80px 32px 40px', color: '#0F172A' }}>
                    <div style={{ maxWidth: 1160, margin: '0 auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 40, marginBottom: 60 }}>
                            {/* Brand Column */}
                            <div style={{ flex: '1 1 360px', maxWidth: 360 }}>
                                <span style={{ fontFamily: "'MADE Okine Sans PERSONAL USE', 'Space Grotesk', 'Outfit', sans-serif", fontWeight: 700, fontSize: '1.05rem', letterSpacing: '0.04em', color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, textTransform: 'uppercase' }}>
                                    <LinkedInIcon size={21} />
                                    Postly-AI
                                </span>
                                <p style={{ color: '#64748B', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 20 }}>
                                    An elegant AI-powered platform designed to help you generate posts instantly, schedule intelligently, and maintain your LinkedIn presence. Made for modern professionals.
                                </p>
                                <p style={{ color: '#64748B', fontSize: '0.8rem' }}>
                                    Designed with love by <a href="https://nisxzn.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color: '#0F172A', fontWeight: 600, borderBottom: '1px solid #CBD5E1', paddingBottom: 2, textDecoration: 'none' }}>Nisxzn</a>
                                </p>
                            </div>

                            {/* Links Columns Group */}
                            <div style={{ display: 'flex', gap: '60px', flexWrap: 'wrap', flex: '1 1 auto', justifyContent: 'flex-start', minWidth: '280px', maxWidth: '600px' }}>
                                {/* Privacy & Legal Column */}
                                <div style={{ minWidth: '140px' }}>
                                    <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0F172A', marginBottom: 20 }}>Privacy & Legal</h4>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        {[
                                            { name: 'Privacy Policy', path: '/privacy' },
                                            { name: 'Terms of Service', path: '/terms' },
                                            { name: 'Security', path: '/security' }
                                        ].map(item => (
                                            <li key={item.name}>
                                                <a
                                                    href={item.path}
                                                    onClick={(e) => { e.preventDefault(); navigate(item.path); }}
                                                    style={{ color: '#64748B', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}
                                                    onMouseEnter={e => e.currentTarget.style.color = '#2563EB'}
                                                    onMouseLeave={e => e.currentTarget.style.color = '#64748B'}
                                                >
                                                    {item.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Resources Column */}
                                <div style={{ minWidth: '140px' }}>
                                    <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0F172A', marginBottom: 20 }}>Resources</h4>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        {[
                                            { name: 'Login', path: '/login?mode=login', type: 'link' },
                                            { name: 'Sign Up', path: '/login?mode=signup', type: 'link' },
                                            { name: 'Features', path: '#features', type: 'hash' },
                                            { name: 'How it works', path: '#how', type: 'hash' }
                                        ].map(item => (
                                            <li key={item.name}>
                                                <a
                                                    href={item.path}
                                                    onClick={(e) => {
                                                        if (item.type === 'link') {
                                                            e.preventDefault(); navigate(item.path);
                                                        }
                                                    }}
                                                    style={{ color: '#64748B', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}
                                                    onMouseEnter={e => e.currentTarget.style.color = '#2563EB'}
                                                    onMouseLeave={e => e.currentTarget.style.color = '#64748B'}
                                                >
                                                    {item.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Connect Column */}
                                <div style={{ minWidth: '140px' }}>
                                    <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0F172A', marginBottom: 20 }}>Connect</h4>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        {[
                                            { name: 'GitHub', path: 'https://github.com/nisxzn', external: true },
                                            { name: 'LinkedIn', path: 'https://www.linkedin.com/in/nithishparameswaran', external: true },
                                            { name: 'Instagram', path: 'https://instagram.com/_nisxzn_', external: true },
                                            { name: 'Email', path: 'mailto:nithishparameswaran2005@gmail.com', external: false }
                                        ].map(item => (
                                            <li key={item.name}>
                                                <a
                                                    href={item.path}
                                                    target={item.external ? "_blank" : undefined}
                                                    rel={item.external ? "noopener noreferrer" : undefined}
                                                    style={{ color: '#64748B', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}
                                                    onMouseEnter={e => e.currentTarget.style.color = '#2563EB'}
                                                    onMouseLeave={e => e.currentTarget.style.color = '#64748B'}
                                                >
                                                    {item.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div style={{
                            paddingTop: 30,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 16
                        }}>
                            <p style={{ color: '#94A3B8', fontSize: '0.8rem' }}>
                                © {new Date().getFullYear()} POSTLY-AI. All rights reserved.
                            </p>
                            <p style={{ color: '#94A3B8', fontSize: '0.8rem' }}>
                                Crafted by <a href="https://nisxzn.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color: '#0F172A', fontWeight: 500, textDecoration: 'none' }}>Nisxzn</a>
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    )
}
