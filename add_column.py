from sqlalchemy import create_engine, text
from backend.database import SQLALCHEMY_DATABASE_URL
import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

def add_column():
    print(f"Connecting to {SQLALCHEMY_DATABASE_URL}")
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    
    with engine.connect() as conn:
        print("Adding image_url column to events table...")
        try:
            conn.execute(text("ALTER TABLE events ADD COLUMN image_url VARCHAR"))
            print("Column added successfully.")
        except Exception as e:
            print(f"Error adding column: {e}")
            print("Column might already exist.")

if __name__ == "__main__":
    add_column()
