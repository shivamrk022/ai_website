from app import app, db, User

with app.app_context():
    users = User.query.all()
    print("--- USERS IN DATABASE ---")
    for user in users:
        print(f"ID: {user.id} | Name: {user.name} | Email: {user.email}")
        print(f"Profile Picture: {user.profile_pic}")
        print("-" * 40)
