# Development Setup Guide

Follow these steps to set up LinkedAI for local development.

## Prerequisites

- Python 3.9+
- Node.js 18+
- LinkedIn Developer Account (for API keys)
- OpenAI API Key

## 1. Backend Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Nisxzn/LinkedIn-Post-Automation.git
   cd LinkedIn-Post-Automation
   ```

2. **Create a virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=sqlite:///./app.db
   SECRET_KEY=your_secret_key
   OPENAI_API_KEY=your_openai_key
   LINKEDIN_CLIENT_ID=your_linkedin_client_id
   LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
   LINKEDIN_REDIRECT_URI=http://localhost:5173/linkedin/callback
   ```

5. **Run the server**:
   ```bash
   uvicorn main:app --reload
   ```

## 2. Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`.

## 3. LinkedIn API Configuration

Ensure your LinkedIn App has the following permissions:
- `w_member_social` (to post content)
- `openid`
- `profile`
- `email`

Set the Authorized Redirect URL to `http://localhost:5173/linkedin/callback`.
