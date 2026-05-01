import os
from dotenv import load_dotenv
from sqlalchemy import text
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///users.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

def upgrade_db():
    with app.app_context():
        try:
            # Check if using postgres
            if 'postgresql' in app.config['SQLALCHEMY_DATABASE_URI']:
                db.session.execute(text("ALTER TABLE users ADD COLUMN profile_pic VARCHAR(255);"))
                db.session.commit()
                print("PostgreSQL database upgraded successfully: profile_pic added.")
            else:
                db.session.execute(text("ALTER TABLE users ADD COLUMN profile_pic VARCHAR(255);"))
                db.session.commit()
                print("SQLite database upgraded successfully: profile_pic added.")
        except Exception as e:
            if "already exists" in str(e) or "duplicate column name" in str(e):
                print("Column 'profile_pic' already exists. Safe to proceed.")
            else:
                print(f"Error upgrading database: {e}")

if __name__ == '__main__':
    upgrade_db()
