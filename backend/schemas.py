from pydantic import BaseModel, EmailStr, validator, Field, field_validator
from typing import Optional, List, Any
from datetime import datetime, date as dt_date, time as dt_time

# ==================== USER SCHEMAS ====================

class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: str
    department: str
    year: int
    
    @validator('year')
    def validate_year(cls, v):
        if v < 1 or v > 4:
            raise ValueError('Year must be between 1 and 4')
        return v

class UserCreate(UserBase):
    password: str
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    full_name: Optional[str] = None
    department: Optional[str] = None
    year: Optional[int] = None
    password: Optional[str] = None
    
    @validator('year')
    def validate_year(cls, v):
        if v is not None and (v < 1 or v > 4):
            raise ValueError('Year must be between 1 and 4')
        return v

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    username: str
    full_name: str
    department: str
    year: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# ==================== TASK SCHEMAS ====================

class TaskBase(BaseModel):
    task_description: str
    deadline: datetime
    priority: Optional[str] = "medium"
    notes: Optional[str] = None
    
    @validator('priority')
    def validate_priority(cls, v):
        if v not in ['low', 'medium', 'high']:
            raise ValueError('Priority must be low, medium, or high')
        return v

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    task_description: Optional[str] = None
    deadline: Optional[datetime] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    notes: Optional[str] = None
    
    @validator('status')
    def validate_status(cls, v):
        if v is not None and v not in ['pending', 'completed', 'cancelled']:
            raise ValueError('Status must be pending, completed, or cancelled')
        return v
    
    @validator('priority')
    def validate_priority(cls, v):
        if v is not None and v not in ['low', 'medium', 'high']:
            raise ValueError('Priority must be low, medium, or high')
        return v

class TaskResponse(BaseModel):
    id: int
    user_id: int
    task_description: str
    deadline: datetime
    priority: Optional[str] = "medium"
    notes: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# ==================== EVENT SCHEMAS ====================

class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    date: dt_date
    time: Optional[dt_time] = None
    venue: Optional[str] = None
    event_type: str
    image_url: Optional[str] = None
    max_participants: Optional[int] = None
    registration_required: bool = False
    registration_link: Optional[str] = None
    
    @field_validator('time', mode='before')
    @classmethod
    def parse_time(cls, v):
        """Parse time string to time object"""
        if v is None or v == '':
            return None
        if isinstance(v, dt_time):
            return v
        if isinstance(v, str):
            # Handle HH:MM or HH:MM:SS format
            parts = v.split(':')
            if len(parts) == 2:
                # HH:MM format
                try:
                    return dt_time(int(parts[0]), int(parts[1]))
                except (ValueError, IndexError):
                    raise ValueError(f'Invalid time format: {v}. Expected HH:MM or HH:MM:SS')
            elif len(parts) == 3:
                # HH:MM:SS format
                try:
                    return dt_time(int(parts[0]), int(parts[1]), int(parts[2]))
                except (ValueError, IndexError):
                    raise ValueError(f'Invalid time format: {v}. Expected HH:MM or HH:MM:SS')
            else:
                raise ValueError(f'Invalid time format: {v}. Expected HH:MM or HH:MM:SS')
        return v
    
    @validator('event_type')
    def validate_event_type(cls, v):
        valid_types = ['tournament', 'practice', 'meeting', 'workshop']
        if v not in valid_types:
            raise ValueError(f'Event type must be one of: {", ".join(valid_types)}')
        return v
    
    @validator('max_participants')
    def validate_max_participants(cls, v):
        if v is not None and v <= 0:
            raise ValueError('Max participants must be positive')
        return v

class EventCreate(EventBase):
    pass

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    date: Optional[dt_date] = None
    time: Optional[dt_time] = None
    venue: Optional[str] = None
    event_type: Optional[str] = None
    image_url: Optional[str] = None
    max_participants: Optional[int] = None
    registration_required: Optional[bool] = None
    registration_link: Optional[str] = None
    is_active: Optional[bool] = None
    
    @validator('event_type')
    def validate_event_type(cls, v):
        if v is not None:
            valid_types = ['tournament', 'practice', 'meeting', 'workshop']
            if v not in valid_types:
                raise ValueError(f'Event type must be one of: {", ".join(valid_types)}')
        return v


class EventResponse(EventBase):
    id: int
    image_url: Optional[str] = None
    max_participants: Optional[int] = None
    registration_required: bool = False
    registration_link: Optional[str] = None
    is_active: bool = True
    created_by: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# ==================== PUZZLE SCHEMAS ====================

class PuzzleBase(BaseModel):
    title: str
    fen: str
    solution: List[str]
    difficulty: str
    theme: Optional[str] = None

    @validator('difficulty')
    def validate_difficulty(cls, v):
        if v not in ['Easy', 'Medium', 'Hard']:
            raise ValueError('Difficulty must be Easy, Medium, or Hard')
        return v

class PuzzleCreate(PuzzleBase):
    pass

class PuzzleUpdate(BaseModel):
    title: Optional[str] = None
    fen: Optional[str] = None
    solution: Optional[List[str]] = None
    difficulty: Optional[str] = None
    theme: Optional[str] = None

    @validator('difficulty')
    def validate_difficulty(cls, v):
        if v is not None and v not in ['Easy', 'Medium', 'Hard']:
            raise ValueError('Difficulty must be Easy, Medium, or Hard')
        return v

class PuzzleResponse(PuzzleBase):
    id: int
    created_at: datetime
    
    class Config:
        orm_mode = True

class BotConfig(BaseModel):
    token: str
    engine: str


# ==================== AUTH SCHEMAS ====================

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# ==================== TASK EXTRACTION SCHEMAS ====================

class TaskExtractionRequest(BaseModel):
    text: str

class TaskExtractionResponse(BaseModel):
    message: str
    extracted_tasks: List[dict]
    saved_tasks: List[dict]

class AudioTaskExtractionResponse(BaseModel):
    message: str
    transcribed_text: str
    extracted_tasks: List[dict]
    saved_tasks: List[dict]
