# 🤖 Multi-Agent AI Document System

An AI-powered document assistant that allows users to upload PDF documents, ask questions in natural language, and receive intelligent answers using Retrieval-Augmented Generation (RAG).

---

## 🚀 Features

- 🔐 JWT Authentication (Login & Registration)
- 📄 Upload PDF Documents
- 🤖 AI Chat using Llama 3.2 (Ollama)
- 🔎 Semantic Search using ChromaDB
- 📚 Source Citation Display
- 💬 Chat History
- 📑 PDF Preview
- 📤 Export Chat as PDF
- 📋 Copy AI Responses
- 🗂️ Document Management (Upload/Delete)
- 👤 User Profile
- 🔒 Protected Routes
- 📱 Responsive UI
- 🎨 Modern Dashboard

---

# 📸 Screenshots

## Login

(Add Screenshot)

---

## Dashboard

(Add Screenshot)

---

## AI Chat

(Add Screenshot)

---

## PDF Preview

(Add Screenshot)

---

## Profile

(Add Screenshot)

---

# 🛠 Tech Stack

## Frontend

- React.js
- Tailwind CSS
- React Router
- Axios
- React Hot Toast
- jsPDF

## Backend

- FastAPI
- SQLAlchemy
- SQLite
- JWT Authentication

## AI

- Ollama
- Llama 3.2
- ChromaDB
- LangChain

---

# 📂 Project Structure

```
Multi-Agent-Document-System
│
├── backend
│   ├── app
│   │   ├── api
│   │   ├── models
│   │   ├── services
│   │   ├── database
│   │   └── main.py
│   │
│   ├── uploads
│   ├── chroma_db
│   └── requirements.txt
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   └── App.jsx
│   │
│   └── package.json
│
└── README.md
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/shadilmuhammed/Multi-Agent-Document-System.git
```

```
cd Multi-Agent-Document-System
```

---

# Backend Setup

```
cd backend
```

Create Virtual Environment

```bash
python -m venv venv
```

Activate

### Windows

```bash
venv\Scripts\activate
```

### Linux / Mac

```bash
source venv/bin/activate
```

Install Packages

```bash
pip install -r requirements.txt
```

Run Backend

```bash
uvicorn app.main:app --reload
```

Backend runs on

```
http://localhost:8000
```

---

# Frontend Setup

```
cd frontend
```

Install Packages

```bash
npm install
```

Run

```bash
npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

# Workflow

```
User Login
      │
      ▼
Upload PDF
      │
      ▼
Extract Text
      │
      ▼
Generate Embeddings
      │
      ▼
Store in ChromaDB
      │
      ▼
Ask Question
      │
      ▼
Semantic Search
      │
      ▼
Relevant Chunks
      │
      ▼
Llama 3.2
      │
      ▼
AI Response
```

---

# API Endpoints

## Authentication

```
POST /auth/register
POST /auth/login
GET /auth/me
```

---

## Documents

```
POST /upload
GET /documents
DELETE /documents/{id}
```

---

## Chat

```
POST /search
GET /chat/{document_id}
```

---

## Statistics

```
GET /stats
```

---

# Future Improvements

- Voice Chat
- Multi-PDF Chat
- OCR Support
- Dark Mode
- Cloud Storage
- Admin Dashboard
- AI Conversation Memory
- Docker Deployment

---

# Author

**Muhammed Shadil**

- GitHub: https://github.com/shadilmuhammed
- LinkedIn: https://www.linkedin.com/in/muhammed-shadil-ab3803246

---

# License

This project is developed for educational and portfolio purposes.

---

⭐ If you like this project, consider giving it a Star.