<div align="center">
  
<h1> LinkedIn Post Automation Agent </h1>

</div>

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

## 🚀 Quick Start Guide: How to Use

The LinkedIn Post Automation system is designed for high efficiency. Here's how to go from a blank page to a viral post in minutes.

### 1️⃣ Connect Your Profile
Click the **"Connect LinkedIn"** button on the landing page. This uses secure OAuth2 to safely link your account for automated posting.

### 2️⃣ Generate Content with AI
Navigate to the **AI Workspace**. You can:
- **Input a Topic**: e.g., "The future of AI in 2024".
- **Paste a News URL**: Our bot will summarize and craft a compelling LinkedIn post based on the latest trends.
- **Choose Your Tone**: Select from "Professional", "Casual", or "Inspirational".

### 3️⃣ Review & Refine
The AI will generate a draft including optimized hashtags. Use the **Live Editor** to tweak any details or add your own personal touch.

### 4️⃣ Schedule or Post Now
Once satisfied, click:
- **"Post Now"**: To send the update immediately.
- **"Schedule"**: To queue the post for an optimal time (e.g., Tuesday at 9:00 AM) based on engagement patterns.

### 5️⃣ Monitor Performance
Check the **Analytics Dashboard** to see real-time updates on:
- **Profile Impressions**
- **Engagement Rate**
- **Comment Sentiment Analysis**

---

## 🛠 For Developers: Installation

If you'd like to run this locally for development, follow these steps:

1. **Backend**: Install Python packages from `requirements.txt` and run `uvicorn main:app --reload`.
2. **Frontend**: Install dependencies in the `frontend` directory and run `npm run dev`.
3. **Config**: Ensure your `.env` is set up with valid LinkedIn and OpenAI API keys.

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
