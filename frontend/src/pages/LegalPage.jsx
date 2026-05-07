import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Linkedin, ShieldCheck, FileText, Lock, Mail, ExternalLink } from 'lucide-react';

const content = {
    privacy: {
        title: 'Privacy Policy',
        icon: Lock,
        tagline: 'Transparency and trust are our core values.',
        lastUpdated: 'May 6, 2026',
        sections: [
            {
                heading: '1. Overview of Data Collection',
                text: 'We collect information to provide a better experience to all our users. This includes account metadata (email, name) and technical details like IP addresses for security auditing. Our system is designed to minimize data footprint while maximizing service efficiency.'
            },
            {
                heading: '2. LinkedIn Profile Access',
                text: 'Our integration with LinkedIn is strictly controlled via OAuth2. We request permissions for "w_member_social" and "openid". We do not have access to your private messages, connection lists, or any data outside of what is necessary to generate and publish your posts.'
            },
            {
                heading: '3. AI Content Processing',
                text: 'When you generate a post, your input (topics, URLs) is processed by advanced language models. We ensure that your proprietary data is not used to train generic third-party models. Your content remains your intellectual property at all times.'
            },
            {
                heading: '4. Data Retention and Deletion',
                text: 'You have full control over your data. You can delete individual post drafts or your entire account at any time. Upon account deletion, all associated tokens and content data are permanently purged from our active databases within 30 days.'
            },
            {
                heading: '5. Security of Transmission',
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
                heading: '1. Acceptance of Terms',
                text: 'By creating an account or using LinkedAI, you agree to these terms. If you do not agree, you must immediately cease all use of our services. These terms apply to all visitors, users, and others who access the Service.'
            },
            {
                heading: '2. User Responsibility and Content',
                text: 'You are the sole author and owner of the content published via our Service. You are responsible for ensuring that your posts comply with LinkedIn\'s User Agreement and Professional Community Policies. LinkedAI is not liable for any account actions taken by LinkedIn resulting from your content.'
            },
            {
                heading: '3. AI Content Accuracy',
                text: 'AI-generated content is provided "as-is". While our models are highly advanced, they may produce inaccurate or biased information. It is your mandatory responsibility to review, edit, and verify all content before publication.'
            },
            {
                heading: '4. Prohibited Uses',
                text: 'You may not use our Service for: (a) sending unsolicited or unauthorized advertising (Spam); (b) creating fake profiles or misleading content; (c) reverse engineering any part of the platform; or (d) any activity that infringes on the rights of others.'
            },
            {
                heading: '5. Subscription and Payments',
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
                heading: '1. Authentication Architecture',
                text: 'We implement the official LinkedIn OAuth2 flow. This architecture ensures that we never handle or store your LinkedIn passwords. Access tokens are encrypted at rest using AES-256 and stored in secure, isolated environments.'
            },
            {
                heading: '2. Infrastructure Protection',
                text: 'Our backend is hosted on secure cloud infrastructure with 24/7 monitoring. We implement sophisticated rate limiting and Web Application Firewalls (WAF) to prevent DDoS attacks and brute-force attempts on our API endpoints.'
            },
            {
                heading: '3. Data Encryption Standards',
                text: 'All sensitive data is encrypted twice: once at the network layer (TLS 1.3) and once at the storage layer (AES-256). We use cryptographically secure random number generators for all session and token identifiers.'
            },
            {
                heading: '4. Vulnerability Management',
                text: 'We perform continuous dependency scanning and automated vulnerability assessments. Our development lifecycle includes mandatory security reviews for all code changes affecting authentication or data handling.'
            },
            {
                heading: '5. Compliance and Auditing',
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
        <div style={{ minHeight: '100vh', background: '#FAFBFF', fontFamily: 'Inter, sans-serif' }}>
            <nav style={{ 
                height: 72, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)',
                borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', 
                justifyContent: 'center', position: 'sticky', top: 0, zIndex: 100
            }}>
                <div style={{ width: '100%', maxWidth: 1000, padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => navigate('/')}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(37,99,235,0.2)' }}>
                            <Linkedin size={18} color="white" />
                        </div>
                        <span style={{ fontWeight: 800, color: '#0F172A', fontSize: '1.1rem', letterSpacing: '-0.02em' }}>LinkedAI</span>
                    </div>
                    <div style={{ display: 'flex', gap: 24 }}>
                        {['privacy', 'terms', 'security'].map(t => (
                            <button 
                                key={t}
                                onClick={() => navigate(`/${t}`)}
                                style={{ 
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    fontSize: '0.85rem', fontWeight: type === t ? 700 : 500,
                                    color: type === t ? '#2563EB' : '#64748B',
                                    transition: 'color 0.2s', textTransform: 'capitalize'
                                }}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            <main style={{ maxWidth: 1000, margin: '0 auto', padding: '80px 24px' }}>
                <div style={{ display: 'flex', gap: 60, flexWrap: 'wrap' }}>
                    {/* Sidebar / Info Box */}
                    <div style={{ flex: '1 1 300px' }}>
                        <div style={{ position: 'sticky', top: 120 }}>
                            <div style={{ 
                                width: 56, height: 56, borderRadius: 16, background: '#EFF6FF', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 
                            }}>
                                <Icon size={28} color="#2563EB" />
                            </div>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0F172A', marginBottom: 16, letterSpacing: '-0.03em', lineHeight: 1.1 }}>{data.title}</h1>
                            <p style={{ color: '#64748B', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: 32 }}>{data.tagline}</p>
                            
                            <div style={{ padding: '24px', background: 'white', borderRadius: 20, border: '1px solid #F1F5F9', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Key Information</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                        <Lock size={16} color="#2563EB" />
                                        <span style={{ fontSize: '0.85rem', color: '#475569' }}>AES-256 Encrypted</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                        <ShieldCheck size={16} color="#2563EB" />
                                        <span style={{ fontSize: '0.85rem', color: '#475569' }}>LinkedIn OAuth2 Certified</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                        <ExternalLink size={16} color="#2563EB" />
                                        <span style={{ fontSize: '0.85rem', color: '#475569' }}>GDPR Compliant</span>
                                    </div>
                                </div>
                                <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #F1F5F9', fontSize: '0.8rem', color: '#94A3B8' }}>
                                    Last updated: {data.lastUpdated}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Column */}
                    <div style={{ flex: '2 1 500px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 56 }}>
                            {data.sections.map((section, idx) => (
                                <section key={idx}>
                                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1E293B', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <span style={{ color: '#2563EB', opacity: 0.3, fontSize: '1rem', fontFamily: 'monospace' }}>0{idx + 1}</span>
                                        {section.heading}
                                    </h2>
                                    <p style={{ color: '#475569', lineHeight: 1.8, fontSize: '1.05rem' }}>{section.text}</p>
                                </section>
                            ))}
                        </div>

                        <div style={{ marginTop: 100, padding: 48, background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', borderRadius: 32, textAlign: 'center', color: 'white', boxShadow: '0 20px 40px rgba(37,99,235,0.2)' }}>
                            <Mail size={40} style={{ marginBottom: 24, opacity: 0.9 }} />
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 12 }}>Need clarification?</h3>
                            <p style={{ opacity: 0.8, fontSize: '0.95rem', marginBottom: 32, maxWidth: 320, margin: '0 auto 32px' }}>Our dedicated compliance team is ready to answer any questions about our policies.</p>
                            <button 
                                onClick={() => window.location.href = 'mailto:privacy@linkedai.com'}
                                style={{ 
                                    height: 52, padding: '0 32px', borderRadius: 14, background: 'white', 
                                    color: '#2563EB', fontWeight: 700, border: 'none', cursor: 'pointer',
                                    fontSize: '0.95rem', transition: 'transform 0.2s', display: 'inline-flex',
                                    alignItems: 'center', gap: 8
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                Contact Support <ArrowLeft size={18} style={{ transform: 'rotate(180deg)' }} />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            
            <footer style={{ padding: '60px 24px', borderTop: '1px solid #F1F5F9', textAlign: 'center' }}>
                <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>© 2026 LinkedAI Automation Service. All rights reserved.</p>
            </footer>
        </div>
    );
}
