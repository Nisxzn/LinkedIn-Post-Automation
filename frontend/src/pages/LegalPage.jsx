import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, FileText, Lock, Mail, ExternalLink } from 'lucide-react';
import LinkedInIcon from '../components/common/LinkedInIcon';

const content = {
    privacy: {
        title: 'Privacy Policy',
        icon: Lock,
        tagline: 'Transparency and trust are our core values.',
        lastUpdated: 'May 6, 2026',
        sections: [
            {
                heading: 'Overview of Data Collection',
                text: 'We collect information to provide a better experience to all our users. This includes account metadata (email, name) and technical details like IP addresses for security auditing. Our system is designed to minimize data footprint while maximizing service efficiency.'
            },
            {
                heading: 'LinkedIn Profile Access',
                text: 'Our integration with LinkedIn is strictly controlled via OAuth2. We request permissions for "w_member_social" and "openid". We do not have access to your private messages, connection lists, or any data outside of what is necessary to generate and publish your posts.'
            },
            {
                heading: 'AI Content Processing',
                text: 'When you generate a post, your input (topics, URLs) is processed by advanced language models. We ensure that your proprietary data is not used to train generic third-party models. Your content remains your intellectual property at all times.'
            },
            {
                heading: 'Data Retention and Deletion',
                text: 'You have full control over your data. You can delete individual post drafts or your entire account at any time. Upon account deletion, all associated tokens and content data are permanently purged from our active databases within 30 days.'
            },
            {
                heading: 'Security of Transmission',
                text: 'All data exchanged between your browser and our Service, and between our Service and LinkedIn, is protected using industry-standard TLS 1.3 encryption. We employ HSTS to ensure your connection remains secure at all times.'
            }
        ]
    },
    terms: {
        title: 'Terms of Service',
        icon: FileText,
        tagline: 'Defining a fair and productive collaboration.',
        lastUpdated: 'May 6, 2026',
        sections: [
            {
                heading: 'Acceptance of Terms',
                text: 'By creating an account or using LIPost-AI, you agree to these terms. If you do not agree, you must immediately cease all use of our services. These terms apply to all visitors, users, and others who access the Service.'
            },
            {
                heading: 'User Responsibility and Content',
                text: 'You are the sole author and owner of the content published via our Service. You are responsible for ensuring that your posts comply with LinkedIn\'s User Agreement and Professional Community Policies. LIPost-AI is not liable for any account actions taken by LinkedIn resulting from your content.'
            },
            {
                heading: 'AI Content Accuracy',
                text: 'AI-generated content is provided "as-is". While our models are highly advanced, they may produce inaccurate or biased information. It is your mandatory responsibility to review, edit, and verify all content before publication.'
            },
            {
                heading: 'Prohibited Uses',
                text: 'You may not use our Service for: (a) sending unsolicited or unauthorized advertising (Spam); (b) creating fake profiles or misleading content; (c) reverse engineering any part of the platform; or (d) any activity that infringes on the rights of others.'
            },
            {
                heading: 'Subscription and Payments',
                text: 'We reserve the right to modify our pricing structure or introduce premium features. Any changes to paid services will be communicated with at least 30 days notice to all active users.'
            }
        ]
    },
    security: {
        title: 'Security Standards',
        icon: ShieldCheck,
        tagline: 'Enterprise-grade protection for your professional data.',
        lastUpdated: 'May 6, 2026',
        sections: [
            {
                heading: 'Authentication Architecture',
                text: 'We implement the official LinkedIn OAuth2 flow. This architecture ensures that we never handle or store your LinkedIn passwords. Access tokens are encrypted at rest using AES-256 and stored in secure, isolated environments.'
            },
            {
                heading: 'Infrastructure Protection',
                text: 'Our backend is hosted on secure cloud infrastructure with 24/7 monitoring. We implement sophisticated rate limiting and Web Application Firewalls (WAF) to prevent DDoS attacks and brute-force attempts on our API endpoints.'
            },
            {
                heading: 'Data Encryption Standards',
                text: 'All sensitive data is encrypted twice: once at the network layer (TLS 1.3) and once at the storage layer (AES-256). We use cryptographically secure random number generators for all session and token identifiers.'
            },
            {
                heading: 'Vulnerability Management',
                text: 'We perform continuous dependency scanning and automated vulnerability assessments. Our development lifecycle includes mandatory security reviews for all code changes affecting authentication or data handling.'
            },
            {
                heading: 'Compliance and Auditing',
                text: 'We maintain detailed audit logs of all security-critical events. Access to administrative tools is strictly limited and requires multi-factor authentication (MFA) for our internal team members.'
            }
        ]
    }
};

export default function LegalPage() {
    const navigate = useNavigate();
    const location = useLocation();

    // Improved logic for path extraction and type selection
    const path = location.pathname.split('/').pop();
    const type = content[path] ? path : 'privacy';
    const data = content[type];
    const Icon = data.icon;

    // Smooth scroll to top on change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [type]);

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
                <nav style={{
                    height: 72, background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(20px) saturate(180%)',
                    borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', position: 'sticky', top: 0, zIndex: 100
                }}>
                    <div style={{ width: '100%', maxWidth: 1160, padding: '0 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 8 }} onClick={() => navigate('/')}>
                            <LinkedInIcon size={22} />
                            <span style={{
                                fontFamily: "'MADE Okine Sans PERSONAL USE', 'Space Grotesk', 'Outfit', sans-serif", fontWeight: 850,
                                fontSize: '1.25rem', color: '#0F172A', letterSpacing: '0.02em',
                                textTransform: 'uppercase'
                            }}>
                                LIPost-AI
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: 28 }}>
                            {['privacy', 'terms', 'security'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => navigate(`/${t}`)}
                                    style={{
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        fontSize: '0.85rem', fontWeight: type === t ? 700 : 500,
                                        color: type === t ? '#2563EB' : '#64748B',
                                        transition: 'color 0.2s', textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                </nav>

                <main style={{ maxWidth: 1160, margin: '0 auto', padding: '80px 32px 120px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 60, alignItems: 'start' }}>
                        {/* Sidebar / Info Box */}
                        <div style={{ position: 'sticky', top: 120 }}>
                            <div style={{
                                width: 56, height: 56, borderRadius: 18, background: 'rgba(37,99,235,0.04)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
                                border: '1px solid rgba(37,99,235,0.08)'
                            }}>
                                <Icon size={24} color="#2563EB" />
                            </div>
                            <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 700, color: '#0F172A', marginBottom: 16, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                                {data.title}
                            </h1>
                            <p style={{ color: '#64748B', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: 36, maxWidth: 380 }}>{data.tagline}</p>

                            <div style={{ padding: '28px', background: 'white', borderRadius: 24, border: '1px solid #F1F5F9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 20 }}>Key Information</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                        <Lock size={16} color="#2563EB" style={{ opacity: 0.8 }} />
                                        <span style={{ fontSize: '0.85rem', color: '#475569' }}>AES-256 Encrypted</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                        <ShieldCheck size={16} color="#2563EB" style={{ opacity: 0.8 }} />
                                        <span style={{ fontSize: '0.85rem', color: '#475569' }}>LinkedIn OAuth2 Certified</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                        <ExternalLink size={16} color="#2563EB" style={{ opacity: 0.8 }} />
                                        <span style={{ fontSize: '0.85rem', color: '#475569' }}>GDPR Compliant</span>
                                    </div>
                                </div>
                                <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid #F1F5F9', fontSize: '0.8rem', color: '#94A3B8' }}>
                                    Last updated: {data.lastUpdated}
                                </div>
                            </div>
                        </div>

                        {/* Content Column */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 60 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 56 }}>
                                {data.sections.map((section, idx) => (
                                    <section key={idx}>
                                        <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <span style={{ color: '#2563EB', opacity: 0.3, fontSize: '0.9rem', fontFamily: 'monospace' }}>0{idx + 1}</span>
                                            {section.heading}
                                        </h2>
                                        <p style={{ color: '#64748B', lineHeight: 1.7, fontSize: '0.95rem' }}>{section.text}</p>
                                    </section>
                                ))}
                            </div>

                            <div style={{
                                marginTop: 40, padding: '48px 40px',
                                background: 'linear-gradient(135deg, #F8FAFF 0%, #EEF4FF 100%)',
                                borderRadius: 32, textAlign: 'center', color: '#0F172A',
                                border: '1px solid #EBF0FF',
                                boxShadow: '0 4px 20px rgba(37,99,235,0.02)'
                            }}>
                                <div style={{
                                    width: 48, height: 48, borderRadius: 14, background: 'rgba(37,99,235,0.06)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
                                    border: '1px solid rgba(37,99,235,0.1)'
                                }}>
                                    <Mail size={20} color="#2563EB" />
                                </div>
                                <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.4rem', fontWeight: 700, marginBottom: 12 }}>Need clarification?</h3>
                                <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 28, maxWidth: 340, margin: '0 auto 28px' }}>
                                    Our dedicated support team is ready to answer any questions about our policies.
                                </p>
                                <button
                                    onClick={() => window.location.href = 'mailto:privacy@lipost-ai.com'}
                                    style={{
                                        height: 44, padding: '0 24px', borderRadius: 12, background: '#2563EB',
                                        color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer',
                                        fontSize: '0.88rem', transition: 'all 0.2s', display: 'inline-flex',
                                        alignItems: 'center', gap: 8, boxShadow: '0 4px 12px rgba(37,99,235,0.15)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(37,99,235,0.25)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(37,99,235,0.15)';
                                    }}
                                >
                                    Contact Support
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
