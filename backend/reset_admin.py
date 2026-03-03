from database import SessionLocal
from models import User
from auth import get_password_hash
from datetime import datetime
import sys

# Ensure we can import from current directory
sys.path.append('.')

email = "chessclub.sathyabama@gmail.com"
password = "admin123"

def reset_password():
    print(f"Connecting to database...")
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()

        if user:
            print(f"User {email} found.")
            print("Resetting password...")
            user.hashed_password = get_password_hash(password)
            db.commit()
            print("p: Password reset successfully.")
        else:
            print(f"User {email} not found.")
            print("Creating new admin user...")
            new_user = User(
                email=email,
                username="admin",
                full_name="System Admin",
                department="Computer Science",
                year=4,
                hashed_password=get_password_hash(password),
                is_active=True,
                created_at=datetime.utcnow()
            )
            db.add(new_user)
            db.commit()
            print("p: Admin user created successfully.")
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    reset_password()
