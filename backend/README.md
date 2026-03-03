# Chess Club Task Management Backend

A FastAPI-based backend for managing chess club tasks, events, and user management with JWT authentication.

## Features

### 🔐 Authentication & User Management
- User signup/login with JWT tokens
- Password hashing with bcrypt
- Admin-only access for certain features
- Admin email: `chessclub.sathyabama@gmail.com`

### 📝 Task Management
- Create, read, update, delete tasks
- Task extraction from text using NLP (spaCy)
- Audio-to-text conversion using OpenAI Whisper
- Priority levels (low, medium, high)
- Status tracking (pending, completed, cancelled)

### 📅 Event Management (Admin Only)
- Create, update, delete events
- Event types: tournament, practice, meeting, workshop
- Registration management
- Venue and time tracking

### 🔄 Google Calendar Integration
- Sync tasks with Google Calendar
- OAuth2 authentication flow
- Create, update, delete calendar events

### 🧠 AI-Powered Features
- Natural Language Processing for task extraction
- Date parsing with dateparser
- Audio transcription with Whisper

## Tech Stack

- **Framework**: FastAPI
- **Database**: SQLite (with SQLAlchemy ORM)
- **Authentication**: JWT with python-jose
- **Password Hashing**: bcrypt with passlib
- **NLP**: spaCy for task extraction
- **Date Parsing**: dateparser
- **Audio**: OpenAI Whisper (optional)
- **Calendar**: Google Calendar API (optional)

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Install spaCy Model

```bash
python -m spacy download en_core_web_sm
```

### 3. Environment Variables

Create a `.env` file in the backend directory:

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

### 4. Run the Backend

```bash
# Development
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Production
uvicorn main:app --host 0.0.0.0 --port 8000
```

## API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login

### Tasks
- `POST /tasks` - Create task
- `GET /tasks` - Get user tasks
- `PUT /tasks/{task_id}` - Update task
- `DELETE /tasks/{task_id}` - Delete task

### Task Extraction
- `POST /extract-tasks/text` - Extract tasks from text
- `POST /extract-tasks/audio` - Extract tasks from audio

### Events (Admin Only)
- `POST /events` - Create event
- `GET /events` - Get all events
- `PUT /events/{event_id}` - Update event
- `DELETE /events/{event_id}` - Delete event

### User Profile
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile

### Health Check
- `GET /ping` - Health check endpoint

## Database Schema

### Users Table
- `id`: Primary key
- `email`: Unique email address
- `username`: Unique username
- `hashed_password`: Bcrypt hashed password
- `full_name`: User's full name
- `department`: User's department
- `year`: Academic year (1-4)
- `is_active`: Account status
- `google_calendar_token`: OAuth token for calendar sync
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

### Tasks Table
- `id`: Primary key
- `user_id`: Foreign key to users table
- `task_description`: Task description
- `deadline`: Task deadline
- `status`: Task status (pending/completed/cancelled)
- `priority`: Task priority (low/medium/high)
- `notes`: Additional notes
- `created_at`: Task creation timestamp
- `updated_at`: Last update timestamp

### Events Table
- `id`: Primary key
- `title`: Event title
- `description`: Event description
- `date`: Event date
- `time`: Event time
- `venue`: Event venue
- `event_type`: Type of event
- `max_participants`: Maximum participants
- `registration_required`: Whether registration is required
- `registration_link`: Registration link
- `is_active`: Event status
- `created_by`: Foreign key to users table
- `created_at`: Event creation timestamp
- `updated_at`: Last update timestamp

## Usage Examples

### 1. User Registration

```bash
curl -X POST "http://localhost:8000/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "username": "student123",
    "password": "securepassword123",
    "full_name": "John Doe",
    "department": "Computer Science",
    "year": 2
  }'
```

### 2. User Login

```bash
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "securepassword123"
  }'
```

### 3. Create Task

```bash
curl -X POST "http://localhost:8000/tasks" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "task_description": "Prepare for chess tournament",
    "deadline": "2024-02-15T10:00:00",
    "priority": "high",
    "notes": "Need to practice endgame strategies"
  }'
```

### 4. Extract Tasks from Text

```bash
curl -X POST "http://localhost:8000/extract-tasks/text" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I need to prepare for the tournament next week and practice openings tomorrow"
  }'
```

### 5. Create Event (Admin Only)

```bash
curl -X POST "http://localhost:8000/events" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Chess Tournament 2024",
    "description": "Annual inter-college chess tournament",
    "date": "2024-03-15",
    "time": "09:00:00",
    "venue": "Main Auditorium",
    "event_type": "tournament",
    "max_participants": 64,
    "registration_required": true,
    "registration_link": "https://forms.example.com/tournament"
  }'
```

## Development

### Adding New Features

1. **Models**: Add new database models in `models.py`
2. **Schemas**: Create Pydantic schemas in `schemas.py`
3. **Endpoints**: Add new API endpoints in `main.py`
4. **Services**: Create business logic in separate modules

### Testing

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```

### Code Quality

```bash
# Install linting tools
pip install black isort flake8

# Format code
black .
isort .

# Check code quality
flake8
```

## Deployment

### Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables for Production

- Set `SECRET_KEY` to a strong, random string
- Use PostgreSQL or MySQL instead of SQLite
- Configure proper CORS origins
- Set up HTTPS
- Use environment-specific database URLs

## Troubleshooting

### Common Issues

1. **spaCy model not found**: Run `python -m spacy download en_core_web_sm`
2. **Database connection errors**: Check `DATABASE_URL` in `.env`
3. **JWT token errors**: Verify `SECRET_KEY` is set
4. **Google Calendar not working**: Check all Google OAuth environment variables

### Logs

The application logs all operations. Check the console output for debugging information.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.
