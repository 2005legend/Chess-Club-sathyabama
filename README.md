# 🏆 Sathyabama Chess Club Website

A professional, feature-rich chess club website built with React, TypeScript, and TailwindCSS, featuring a FastAPI backend for task management and event organization.

## ✨ Features

### 🌐 Frontend (React + TypeScript + TailwindCSS)
- **Responsive Design**: Mobile-first, modern UI with chess-themed styling
- **Dark/Light Mode**: Theme toggle with local storage persistence
- **Smooth Animations**: Framer Motion animations throughout the interface
- **Component Library**: Reusable UI components using shadcn/ui
- **Routing**: Client-side routing with React Router

### 🔐 Backend (FastAPI + SQLite)
- **User Management**: JWT authentication with bcrypt password hashing
- **Task Management**: Create, read, update, delete tasks with NLP extraction
- **Event Management**: Admin-only event creation and management
- **AI Features**: Natural language task extraction using spaCy
- **Audio Processing**: OpenAI Whisper integration for voice-to-text
- **Calendar Integration**: Google Calendar sync (optional)

### 📱 Core Pages
- **Home**: Hero section, club introduction, WhatsApp integration
- **About**: Club history, mission, achievements
- **Events**: Tournament and event listings with registration
- **Members**: Club member directory and profiles
- **Puzzle Corner**: Daily chess puzzles and challenges
- **Game of the Week**: Featured chess games and analysis
- **Contact**: Contact information and location map
- **Admin Panel**: Event and task management interface

### 🚀 Special Features
- **WhatsApp Integration**: Direct links to club WhatsApp group
- **Task Extraction**: AI-powered task extraction from text and audio
- **Event Management**: Comprehensive event creation and management
- **Responsive Gallery**: Photo grid with filtering and lightbox
- **Admin Dashboard**: Statistics and management tools

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Routing**: React Router
- **State Management**: React Hooks
- **Forms**: React Hook Form + Zod validation

### Backend
- **Framework**: FastAPI
- **Database**: SQLite with SQLAlchemy ORM
- **Authentication**: JWT with python-jose
- **Password Hashing**: bcrypt with passlib
- **NLP**: spaCy for task extraction
- **Date Parsing**: dateparser
- **Audio**: OpenAI Whisper (optional)
- **Calendar**: Google Calendar API (optional)

## 🚀 Quick Start

### Frontend Development
```bash
# Navigate to project directory
cd sathyabama-chess-hub-main/sathyabama-chess-hub-main

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Development
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Install spaCy model
python -m spacy download en_core_web_sm

# Create .env file (see Environment Variables section)
# Run the backend
python run.py

# Or use uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## ⚙️ Environment Variables

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_WHATSAPP_GROUP_URL=https://chat.whatsapp.com/JKQYySbdVV23oDsficIU64
```

### Backend (.env)
```env
# Database Configuration
DATABASE_URL=sqlite:///./chess_club.db

# Security
SECRET_KEY=your-super-secret-key-change-this-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Google Calendar Integration (Optional)
GOOGLE_CALENDAR_API_KEY=your-google-calendar-api-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback

# OpenAI Integration (Optional - for Whisper audio transcription)
OPENAI_API_KEY=your-openai-api-key

# Admin Configuration
ADMIN_EMAIL=chessclub.sathyabama@gmail.com
```

## 📁 Project Structure

```
sathyabama-chess-hub-main/
├── src/
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   ├── layout/       # Layout components (Navbar, Footer)
│   │   ├── home/         # Homepage components
│   │   └── admin/        # Admin panel components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and configurations
│   └── App.tsx           # Main application component
├── backend/               # FastAPI backend
│   ├── main.py           # Main FastAPI application
│   ├── models.py         # Database models
│   ├── schemas.py        # Pydantic schemas
│   ├── auth.py           # Authentication logic
│   ├── database.py       # Database configuration
│   ├── task_extractor.py # NLP task extraction
│   ├── calendar_integration.py # Google Calendar integration
│   ├── requirements.txt  # Python dependencies
│   └── README.md         # Backend documentation
├── public/                # Static assets
├── tailwind.config.ts     # TailwindCSS configuration
├── package.json           # Node.js dependencies
└── README.md              # This file
```

## 🔧 Configuration

### TailwindCSS
The project uses a custom TailwindCSS configuration with chess-themed colors:
- `chess-black`: #1a1a1a
- `chess-white`: #f8f9fa
- `chess-accent`: #d4af37 (gold)
- `chess-dark`: #2d2d2d
- `chess-light`: #f5f5f5

### Database Schema
The backend includes three main tables:
- **Users**: User accounts with authentication
- **Tasks**: User tasks with deadlines and priorities
- **Events**: Club events with registration management

## 📱 WhatsApp Integration

The website includes multiple entry points to the club's WhatsApp group:
- Homepage CTA button
- QuickLinks component
- Membership page alternatives
- All "Join Club" buttons redirect to WhatsApp

**WhatsApp Group**: [https://chat.whatsapp.com/JKQYySbdVV23oDsficIU64](https://chat.whatsapp.com/JKQYySbdVV23oDsficIU64)

## 👑 Admin Access

The admin panel is accessible at `/admin` and provides:
- Event creation and management
- Task overview and statistics
- User management capabilities
- Club operation insights

**Admin Email**: `chessclub.sathyabama@gmail.com`

## 🧪 Testing

### Frontend Testing
```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Backend Testing
```bash
cd backend

# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest

# Run specific test file
pytest test_api.py
```

### API Testing
```bash
# Test the backend API
cd backend
python test_api.py
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
# Build the project
npm run build

# Deploy to Vercel
vercel --prod

# Or deploy to Netlify
netlify deploy --prod
```

### Backend (VPS/Cloud)
```bash
# Install production dependencies
pip install -r requirements.txt

# Set production environment variables
# Run with production server
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Docker Deployment
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation with Pydantic
- CORS configuration
- Admin-only access controls
- Secure environment variable handling

## 📊 Performance

- Lazy loading of components
- Optimized images and assets
- Efficient state management
- Responsive design for all devices
- Fast API responses with async/await

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- **Email**: chessclub.sathyabama@gmail.com
- **WhatsApp**: [Join our group](https://chat.whatsapp.com/JKQYySbdVV23oDsficIU64)
- **Issues**: Create an issue on GitHub

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by chess community needs
- Designed for educational institutions
- Open source and community-driven

---

**Made with ♟️ for the Chess Community**
