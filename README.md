# Study Agent 🎓

> Your AI-powered study companion — organize, understand, and never miss a deadline.

Study Agent is an academic assistant that connects to the tools students already use 
and brings everything together in one intelligent interface powered by Gemini.

## ✨ Features

- 📚 **Google Classroom** — track assignments, deadlines, and announcements
- 📁 **Google Drive** — AI-generated summaries and flashcards from your own documents
- 🔍 **Semantic Search** — find content across all your Drive files using Elasticsearch
- 📅 **Google Calendar** — auto-create reminders for tasks and exams
- 📧 **Gmail** — stay on top of academic notifications
- 🎥 **YouTube** — get video recommendations relevant to your coursework
- 📝 **Notion** — store notes, study plans, and summaries
- 🤖 **AI Chat** — student-focused assistant that explains concepts, reviews rubrics, and keeps you on track

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| AI | Gemini |
| Backend | Python, FastAPI |
| Frontend | React, Netlify |
| Cloud | Google Cloud Run, Docker |
| Search | Elasticsearch |
| APIs | Google Classroom, Drive, Gmail, Calendar, YouTube, Notion |

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Google Cloud project with OAuth credentials
- Elasticsearch instance
- Notion integration token

### Installation

```bash
git clone https://github.com/AIsaacCh/study-agent.git
cd study-agent
pip install -r requirements.txt
```

### Environment Variables

Create a `.env` file in `/backend`:

```env
GEMINI_API_KEY=your_key
ELASTIC_ENDPOINT=your_endpoint
ELASTIC_API_KEY=your_key
NOTION_TOKEN=your_token
GOOGLE_TOKEN_B64=your_base64_token
GOOGLE_CLOUD_PROJECT=your_project_id
GOOGLE_CLOUD_REGION=us-central1
```

### Run locally

```bash
cd backend
uvicorn main:app --reload
```

## 🤝 Contributing

Pull requests are welcome! Students, developers, and educators — if you have ideas 
to make this better, open an issue or submit a PR. The best features will come from 
the students who use it every day.

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

Built for the [Google Cloud Rapid Agent Hackathon](https://rapid-agent.devpost.com/) 🏆
