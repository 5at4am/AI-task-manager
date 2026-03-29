# Task Manager - Full Stack Application

A production-ready task management application with AI-powered features.

## Features

### 🔐 Authentication
- **Sign Up / Login** - Secure user authentication with JWT tokens
- **Forgot Password** - Request password reset token
- **Reset Password** - Set new password with token
- **Protected Routes** - Secure dashboard access
- **Persistent Sessions** - Stay logged in across refreshes

### 📋 Task Management
- **Create Tasks** with:
  - Title & Description
  - Priority levels (Low, Medium, High)
  - Status (To Do, In Progress, Done)
  - Tags (comma-separated)
  - Due dates
- **Update Tasks** - Edit any task field
- **Delete Tasks** - Remove with confirmation
- **Toggle Status** - Quick complete/incomplete
- **Filter Tasks** - By status (All, To Do, In Progress, Done)
- **Sort Tasks** - By creation date, priority, status, title

### 🤖 AI Features (Backend Integration)
- **AI Task Suggestions** - Get AI-powered suggestions for task improvement
- **AI Task Summary** - Generate intelligent summaries of all your tasks
- **Multiple AI Providers**:
  - Google Gemini (gemini-2.0-flash)
  - OpenAI GPT-4o-mini
  - Groq (Llama models)

### 📊 Dashboard
- **Task Statistics** - Total, To Do, In Progress, Done counts
- **Visual Status** - Color-coded priority and status badges
- **Tag Display** - See all task tags at a glance
- **Due Date Tracking** - Never miss deadlines
- **Empty States** - Helpful messages when no tasks exist

## Tech Stack

### Frontend
- **React 19** - UI framework
- **React Router v7** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management

### Backend
- **FastAPI** - Python REST API
- **LangChain** - AI/LLM integration
- **JWT** - Token authentication
- **In-memory store** - Task & user storage

## Project Structure

```
task_manager/
├── backend/
│   ├── server/
│   │   ├── auth/          # Authentication endpoints
│   │   ├── tasks/         # Task CRUD endpoints
│   │   ├── ai/            # AI suggestion & summary endpoints
│   │   └── main.py        # FastAPI app entry
│   ├── requirements.txt
│   └── .env               # API keys
│
└── frontend/
    ├── src/
    │   ├── components/    # Reusable UI components
    │   │   ├── Navbar.jsx
    │   │   ├── Button.jsx
    │   │   ├── Input.jsx
    │   │   ├── Card.jsx
    │   │   ├── Alert.jsx
    │   │   ├── TaskItem.jsx
    │   │   ├── TaskForm.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── contexts/      # React contexts
    │   │   ├── AuthContext.jsx
    │   │   └── TasksContext.jsx
    │   ├── pages/         # Page components
    │   │   ├── Landing.jsx
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── ForgotPassword.jsx
    │   │   ├── ResetPassword.jsx
    │   │   └── Dashboard.jsx
    │   ├── services/      # API services
    │   │   └── api.js
    │   └── App.jsx
    └── package.json
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Create new account |
| POST | `/auth/login` | Login and get JWT token |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/reset-password` | Reset password with token |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks/` | List all tasks (with filters) |
| GET | `/tasks/{id}` | Get single task |
| POST | `/tasks/` | Create new task |
| PATCH | `/tasks/{id}` | Update task |
| DELETE | `/tasks/{id}` | Delete task |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/ai/suggest` | Get AI suggestions for task |
| POST | `/ai/summarize` | Get AI summary of tasks |

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- API keys (Gemini, OpenAI, or Groq)

### 1. Setup Backend

```bash
cd task_manager/backend

# Install dependencies
uv pip install -r requirements.txt

# Start server
uv run uvicorn server.main:app --reload --host 0.0.0.0 --port 8000
```

Backend runs on: `http://localhost:8000`

### 2. Setup Frontend

```bash
cd task_manager/frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs on: `http://localhost:3000`

## Usage Guide

### 1. Create Account
1. Go to `/signup`
2. Enter name, email, password
3. Click "Create Account"

### 2. Login
1. Go to `/login`
2. Enter email and password
3. Click "Sign In"

### 3. Create Task
1. Click "Add Task" button on dashboard
2. Fill in task details:
   - Title (required)
   - Description
   - Priority level
   - Status
   - Tags (comma-separated)
   - Due date
3. Click "✨ AI Suggest" for AI recommendations
4. Click "Create Task"

### 4. Manage Tasks
- **Complete**: Click checkbox
- **Edit**: Click edit icon (coming soon)
- **Delete**: Click delete icon
- **Filter**: Use status filter buttons

### 5. AI Features
- **AI Suggest**: While creating task, click "✨ AI Suggest"
- **AI Summary**: On dashboard, click "✨ AI Summary"

## Environment Variables

Backend `.env` file:
```env
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key
GROQ_API_KEY=your_groq_key
```

## Design System

- **Clean, modern UI** with white/gray color scheme
- **Responsive design** - works on mobile, tablet, desktop
- **Accessible** - ARIA labels, keyboard navigation
- **Loading states** - Spinners during async operations
- **Error handling** - User-friendly error messages
- **Success feedback** - Confirmation messages

## Security

- JWT tokens stored in localStorage
- Passwords hashed with bcrypt (backend)
- Protected routes require authentication
- Auto-logout on 401 errors
- CORS configured for frontend origin

## Future Enhancements

- [ ] Task editing modal
- [ ] Drag-and-drop reordering
- [ ] Task search
- [ ] Email notifications
- [ ] Task comments
- [ ] File attachments
- [ ] Team collaboration
- [ ] Dark mode
- [ ] Export tasks (CSV, PDF)
- [ ] Recurring tasks

## Troubleshooting

### Backend not starting?
```bash
# Check Python version
python --version  # Should be 3.10+

# Reinstall dependencies
uv pip install -r requirements.txt
```

### Frontend build errors?
```bash
# Clear node_modules
rm -rf node_modules package-lock.json
npm install
```

### API not connecting?
- Ensure backend is running on port 8000
- Check CORS settings in `backend/server/main.py`
- Verify proxy config in `frontend/vite.config.js`

### AI features not working?
- Check API keys in `.env` file
- Ensure you have internet connection
- Check rate limits for your AI provider
