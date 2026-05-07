# Enterprise Security Standards

At LinkedAI, we treat the security of your professional identity and data with the highest priority. Our security framework is designed to meet enterprise-grade standards.

---

## 1. Authentication and Authorization

### 1.1 LinkedIn OAuth2 Protocol
We implement the official LinkedIn OAuth2 flow. 
- **No Password Storage**: We never ask for, see, or store your LinkedIn password.
- **Scope Limitation**: We only request the minimum necessary permissions (`w_member_social`, `openid`, `profile`, `email`) required to automate your posts.
- **Token Management**: Access tokens are stored using AES-256 encryption and are automatically refreshed using secure rotation mechanisms.

### 1.2 JWT (JSON Web Tokens)
User sessions on LinkedAI are managed via JWT.
- **Signature**: All tokens are signed with a strong secret key unique to our backend.
- **Expiration**: Tokens have a limited lifespan to mitigate the risk of token theft.
- **HttpOnly Cookies**: Where applicable, tokens are stored in HttpOnly, Secure cookies to prevent XSS attacks.

---

## 2. Data Protection

### 2.1 Encryption at Rest
All data stored in our SQLite/PostgreSQL databases is encrypted using industry-standard AES-256 algorithms. This includes:
- User metadata.
- Post drafts and history.
- Cached analytics.

### 2.2 Encryption in Transit
All communication between your browser and our servers, and between our servers and third-party APIs (OpenAI, LinkedIn), is conducted over **TLS 1.3** encrypted channels. We enforce HSTS (HTTP Strict Transport Security) to prevent downgrade attacks.

---

## 3. Infrastructure and Operations

### 3.1 Backend Isolation
Our AI processing engine and scheduling service run in isolated environments to prevent cross-contamination. 
- **Environment Variables**: Sensitive keys (OpenAI API key, LinkedIn Secrets) are never hardcoded and are managed through a secure environment management system.
- **Rate Limiting**: We implement sophisticated rate limiting to prevent Brute Force and DDoS attacks.

### 3.2 Regular Security Audits
We perform the following regularly:
- **Dependency Scanning**: Automated tools check our `requirements.txt` and `package.json` for known vulnerabilities.
- **Code Reviews**: All security-critical code changes undergo rigorous peer review.
- **Penetration Testing**: Periodic internal testing to identify and remediate potential attack vectors.

---

## 4. Responsible Disclosure Policy

If you believe you have found a security vulnerability in LinkedAI, we encourage you to let us know right away. We will investigate all legitimate reports and do our best to quickly fix the problem.
- **Email**: security@linkedai.com
- **Policy**: We will not take legal action against you if you follow our disclosure guidelines, provide a detailed report, and give us a reasonable amount of time to respond before making any information public.
