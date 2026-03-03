from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, ForeignKey, Date, Time, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    department = Column(String, nullable=False)
    year = Column(Integer, nullable=False)
    is_active = Column(Boolean, default=True)
    google_calendar_token = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    tasks = relationship("Task", back_populates="user")
    events_created = relationship("Event", back_populates="created_by_user")

class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    task_description = Column(Text, nullable=False)
    deadline = Column(DateTime, nullable=False)
    status = Column(String, default="pending")  # pending, completed, cancelled
    priority = Column(String, default="medium")  # low, medium, high
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="tasks")

class Event(Base):
    __tablename__ = "events"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    date = Column(Date, nullable=False)
    time = Column(Time, nullable=True)
    venue = Column(String, nullable=True)
    event_type = Column(String, nullable=False)  # tournament, practice, meeting, workshop
    image_url = Column(String, nullable=True) # Add this line
    max_participants = Column(Integer, nullable=True)
    registration_required = Column(Boolean, default=False)
    registration_link = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    created_by_user = relationship("User", back_populates="events_created")

class Puzzle(Base):
    __tablename__ = "puzzles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    fen = Column(String, nullable=False)
    solution = Column(JSON, nullable=False)
    difficulty = Column(String, nullable=False)  # Easy, Medium, Hard
    theme = Column(String, nullable=True)
    date = Column(Date, default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
