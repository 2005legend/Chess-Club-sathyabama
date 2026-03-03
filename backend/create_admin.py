
import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

from models import Base, User
from auth import get_password_hash, ADMIN_EMAIL

load_dotenv()

# Use the same database URL as the main application
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./chess_club.db")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# This will drop and recreate tables, ensuring the schema is up to date.
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

def create_admin_user(password: str):
    db = SessionLocal()
    try:
        admin_user = db.query(User).filter(User.email == ADMIN_EMAIL).first()
        if admin_user:
            print(f"Admin user with email '{ADMIN_EMAIL}' already exists.")
            admin_user.hashed_password = get_password_hash(password)
            db.commit()
            print("Admin password has been updated.")
        else:
            print(f"Creating admin user with email: {ADMIN_EMAIL}")
            username = ADMIN_EMAIL.split('@')[0]
            full_name = "Admin"
            department = "Administration"
            year = 0

            existing_user = db.query(User).filter(User.username == username).first()
            if existing_user:
                print(f"Username '{username}' already exists. Cannot create admin.")
                return

            hashed_password = get_password_hash(password)
            new_admin = User(
                email=ADMIN_EMAIL,
                username=username,
                hashed_password=hashed_password,
                full_name=full_name,
                department=department,
                year=year,
                is_active=True
            )
            db.add(new_admin)
            db.commit()
            print("Admin user created successfully!")
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python create_admin.py <password>")
        sys.exit(1)
    
    password = sys.argv[1]
    create_admin_user(password)
