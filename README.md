# 🚀 LinkedIn Post Automation

A professional, AI-powered system designed to automate LinkedIn content creation and scheduling. This project combines modern AI pipelines with a robust backend and a sleek frontend to streamline your professional presence on LinkedIn.

![LinkedIn Automation Logo](https://img.shields.io/badge/LinkedIn-Automation-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 🛠 Features

- **🤖 AI-Powered Post Generation**: Leverages LangGraph and OpenAI to create high-quality, professional LinkedIn posts from news or custom topics.
- **📅 Automated Scheduling**: Integrated scheduler (APScheduler) for posting content at optimal times.
- **📊 Real-time Analytics**: Tracks post performance and engagement via a dedicated dashboard.
- **🔐 Secure Authentication**: OAuth2 integration with LinkedIn for safe and easy account management.
- **🏗 Robust Pipeline**: Uses LangChain and LangGraph for complex, multi-step AI reasoning.
- **🎨 Modern Dashboard**: A high-performance React (Vite) frontend for managing your automated presence.

---

## 🏗 Technology Stack

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **AI/LLM**: [LangChain](https://www.langchain.com/), [LangGraph](https://github.com/langchain-ai/langgraph), [OpenAI](https://openai.com/)
- **Database**: [SQLAlchemy](https://www.sqlalchemy.org/) with SQLite
- **Scheduling**: [APScheduler](https://apscheduler.readthedocs.io/)
- **Auth**: [FastAPI-Users](https://fastapi-users.github.io/fastapi-users/), [python-jose](https://python-jose.readthedocs.io/)

### Frontend
- **Framework**: [React](https://reactjs.org/) (Vite)
- **Styling**: Vanilla CSS (Tailored Design System)
- **API Client**: Axios / Fetch

---

## 🚀 Getting Started

### 📦 Prerequisites
- Python 3.9+
- Node.js & npm (for frontend)
- LinkedIn Developer API credentials
- OpenAI API Key

### 🛠 Backend Setup
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

4. **Configure environment variables**:
   Create a `.env` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_key
   LINKEDIN_CLIENT_ID=your_id
   LINKEDIN_CLIENT_SECRET=your_secret
   DATABASE_URL=sqlite:///./app.db
   SECRET_KEY=your_secret_key
   ```

5. **Run the server**:
   ```bash
   uvicorn main:app --reload
   ```

### 🎨 Frontend Setup
1. **Navigate to the frontend folder**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

---

## 📂 Project Structure

```text
├── core/               # App configuration & dependencies
├── database/           # DB models & migrations
├── frontend/           # React + Vite source code
├── routes/             # API endpoints (Analytics, Scheduler, etc)
├── scheduler/          # Automation tasks
├── services/           # Business logic (AI, LinkedIn API, Auth)
├── main.py             # Entry point
└── requirements.txt    # Backend dependencies
```

---

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built with ❤️ by nisxzn.</sub>
</div>
