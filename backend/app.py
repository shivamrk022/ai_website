from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
CORS(app, origins="*", methods=["GET", "POST", "OPTIONS"], allow_headers=["Content-Type"])

# ── PostgreSQL Configuration ──
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///users.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Uploads Configuration
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024 # 16 MB max upload size

db = SQLAlchemy(app)

# ── Database Models ──
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    google_id = db.Column(db.String(100), unique=True, nullable=True)
    name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=True) # For manual login
    profile_pic = db.Column(db.String(255), nullable=True) # Profile picture URL or path
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class IndustrialLog(db.Model):
    __tablename__ = 'industrial_logs'
    id = db.Column(db.Integer, primary_key=True)
    event_type = db.Column(db.String(50), nullable=False)
    message = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

# ── Database Migration (JSON to SQL) ──
def migrate_json_to_db():
    USER_FILE = "users.json"
    if os.path.exists(USER_FILE):
        try:
            import json
            with open(USER_FILE, "r") as f:
                users = json.load(f)
            
            migrated_count = 0
            for u in users:
                if not User.query.filter_by(email=u['email']).first():
                    new_user = User(
                        name=u.get('name', 'User'),
                        email=u['email'],
                        password=u.get('password', 'password123')
                    )
                    db.session.add(new_user)
                    migrated_count += 1
            
            if migrated_count > 0:
                db.session.commit()
                print(f"📊 Migration Success: {migrated_count} users moved from JSON to PostgreSQL!")
        except Exception as e:
            print(f"⚠️ Migration Error: {e}")

# Create tables and migrate
with app.app_context():
    db.create_all()
    migrate_json_to_db()

# ── Gemini AI Configuration ──
AI_ENABLED = False
api_key = os.getenv("GOOGLE_API_KEY")
if api_key:
    try:
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-flash-latest")
        AI_ENABLED = True
    except Exception as e:
        print(f"⚠️ Gemini Error: {e}")

# ── Activity Logger Helper ──
def log_activity(event_type, message):
    try:
        new_log = IndustrialLog(event_type=event_type, message=message)
        db.session.add(new_log)
        db.session.commit()
        print(f"📝 Activity Logged: [{event_type}] {message}")
    except Exception as e:
        print(f"⚠️ Logging Error: {e}")

# ── Routes ──
@app.route("/signup", methods=["POST", "OPTIONS"])
def signup():
    if request.method == "OPTIONS": return "", 204
    data = request.json
    email = data.get("email")
    password = data.get("password")
    name = data.get("name")

    if User.query.filter_by(email=email).first():
        return jsonify({"success": False, "message": "Email already exists"}), 400

    new_user = User(name=name, email=email, password=password)
    db.session.add(new_user)
    db.session.commit()
    log_activity("USER_SIGNUP", f"New account created: {email}")
    print(f"👤 New User DB Registered: {email}")
    return jsonify({"success": True, "message": "Signup successful!"}), 201

@app.route("/login", methods=["POST", "OPTIONS"])
def login():
    if request.method == "OPTIONS": return "", 204
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email, password=password).first()
    if user:
        log_activity("USER_LOGIN", f"User logged in: {email}")
        print(f"🔑 User Logged In: {email}")
        return jsonify({
            "success": True, 
            "message": "Login successful!", 
            "name": user.name,
            "profile_pic": user.profile_pic
        }), 200
    return jsonify({"success": False, "message": "Invalid email or password"}), 401

@app.route("/google-login", methods=["POST", "OPTIONS"])
def google_login():
    if request.method == "OPTIONS": return "", 204
    data = request.json
    email = data.get("email")
    name = data.get("name")
    google_id = data.get("google_id")
    picture = data.get("picture")

    if not email:
        return jsonify({"success": False, "message": "Email required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        user = User(email=email, name=name or "Google User", google_id=google_id, profile_pic=picture)
        db.session.add(user)
        db.session.commit()
        log_activity("USER_SIGNUP", f"New Google account created: {email}")
        print(f"👤 New Google User DB Registered: {email}")
    else:
        log_activity("USER_LOGIN", f"Google user logged in: {email}")
        print(f"🔑 Google User Logged In: {email}")

    return jsonify({"success": True, "profile_pic": user.profile_pic, "name": user.name}), 200

@app.route("/change-password", methods=["POST", "OPTIONS"])
def change_password():
    if request.method == "OPTIONS": return "", 204
    data = request.json
    email = data.get("email")
    old_password = data.get("oldPassword")
    new_password = data.get("newPassword")

    user = User.query.filter_by(email=email, password=old_password).first()
    if user:
        user.password = new_password
        db.session.commit()
        print(f"🔒 Password Updated in DB: {email}")
        return jsonify({"success": True, "message": "Password updated successfully!"}), 200
    
    return jsonify({"success": False, "message": "Invalid current password"}), 401
            
    return jsonify({"success": False, "message": "Incorrect current password"}), 401


import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

import random

# Temporary OTP storage
otps = {}

def send_reset_email(target_email, user_name, otp=None):
    sender_email = os.getenv("EMAIL_USER")
    sender_password = os.getenv("EMAIL_PASS")
    
    if not sender_email or not sender_password:
        return False

    try:
        msg = MIMEMultipart()
        msg['From'] = f"Shivam AI Automation <{sender_email}>"
        msg['To'] = target_email
        msg['Subject'] = f"Password Reset Code: {otp}" if otp else "Password Reset Request"

        body = f"""
        Hello {user_name},

        You requested a password reset for your Shivam AI Automation account.
        
        {"Your 6-digit Verification Code is: " + str(otp) if otp else "Click here to reset: http://127.0.0.1:5000/reset"}

        If you did not request this, please ignore this email.
        
        Best regards,
        The Shivam AI Team
        """
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"❌ Email Error: {e}")
        return False

@app.route("/forgot-password", methods=["POST", "OPTIONS"])
def forgot_password():
    if request.method == "OPTIONS": return "", 204
    data = request.json
    email = data.get("email")

    user = User.query.filter_by(email=email).first()
    if user:
        print(f"🔍 Forgot Password: User found ({user.name})")
        # Generate 6-digit OTP
        otp = random.randint(100000, 999999)
        otps[email] = otp
        
        print(f"📧 Attempting to send OTP {otp} to: {email}...")
        success = send_reset_email(email, user.name, otp=otp)
        
        if success:
            log_activity("PWD_RESET_REQ", f"OTP sent to {email}")
            print(f"✅ OTP sent successfully to {email}")
            return jsonify({"success": True, "message": "OTP sent to your Gmail!"}), 200
        else:
            log_activity("ERROR_MAIL", f"Failed to send OTP to {email}")
            print(f"❌ Failed to send OTP to {email}. Check SMTP settings.")
            return jsonify({"success": False, "message": "Failed to send email. Check .env settings."}), 500
    
    log_activity("AUTH_FAILURE", f"Forgot password attempt for unknown email: {email}")
    print(f"❓ Forgot Password: Email {email} not found in database.")
    return jsonify({"success": False, "message": "Email address not found"}), 404

@app.route("/verify-otp", methods=["POST", "OPTIONS"])
def verify_otp():
    if request.method == "OPTIONS": return "", 204
    data = request.json
    email = data.get("email")
    received_otp = data.get("otp")

    if email in otps and str(otps[email]) == str(received_otp):
        return jsonify({"success": True, "message": "OTP Verified!"}), 200
    
    return jsonify({"success": False, "message": "Invalid or expired OTP"}), 400

@app.route("/reset-password-final", methods=["POST", "OPTIONS"])
def reset_password_final():
    if request.method == "OPTIONS": return "", 204
    data = request.json
    email = data.get("email")
    new_password = data.get("newPassword")

    # Double check if OTP was verified (in a real app, use tokens)
    if email not in otps:
        return jsonify({"success": False, "message": "Unauthorized"}), 401

    user = User.query.filter_by(email=email).first()
    if user:
        user.password = new_password
        db.session.commit()
        del otps[email] # Clear OTP
        return jsonify({"success": True, "message": "Password reset successful!"}), 200
            
    return jsonify({"success": False, "message": "User not found"}), 404


# Local fallback responses
def get_local_response(message):
    q = message.lower()
    
    if any(word in q for word in ["plc", "programmable", "logic", "controller"]):
        return "🔧 **PLC Programming**: We specialize in custom PLC programming for Siemens, Allen-Bradley, and Mitsubishi systems. Our solutions handle:\n• Manufacturing automation\n• Process control\n• Real-time monitoring\n\nWant a free consultation?"
    
    if any(word in q for word in ["robot", "robotic", "automation", "arm"]):
        return "🤖 **Robotic Automation**: End-to-end robotic solutions including:\n• Pick & place operations\n• Welding automation\n• Assembly line robotics\n• Collaborative robots (cobots)\n\nAsk about our latest projects!"
    
    if any(word in q for word in ["iot", "smart factory", "industry 4", "connected", "sensor"]):
        return "🏭 **Smart Factory / IoT**: Connect your manufacturing floor with:\n• Real-time data collection\n• Predictive maintenance\n• Machine learning analytics\n• Cloud integration\n\nLet's modernize your factory!"
    
    if any(word in q for word in ["price", "cost", "quote", "pricing", "how much"]):
        return "💰 **Pricing**: Our pricing depends on project scope, complexity, and timeline. Typical projects range from $5,000 to $100,000+.\n\n📞 Contact us for a FREE estimate!\nWhatsApp: +91 97025 15105"
    
    if any(word in q for word in ["contact", "email", "phone", "whatsapp", "reach"]):
        return "📬 **Get in Touch**:\n📧 Email: contact@shivam-ai.com\n📱 WhatsApp: +91 97025 15105\n📍 Location: Palghar, Maharashtra, India\n\nWe typically respond within 2-4 hours!"
    
    if any(word in q for word in ["time", "duration", "how long", "weeks", "months", "implement", "deployment"]):
        return "⏱️ **Implementation Timeline**:\n• Scoping & planning: 1-2 weeks\n• Development: 4-8 weeks\n• Testing & deployment: 2-4 weeks\n\nTypical project: **2-3 months**\n\nRush projects available!"
    
    if any(word in q for word in ["hello", "hi", "hey", "morning", "afternoon", "good day"]):
        return "👋 Hey there! Welcome to Shivam AI Automation. I'm here to help with:\n• Industrial PLC Programming\n• Robotic Process Automation\n• Smart Factory & IoT Solutions\n\nWhat can I help you with?"
    
    if any(word in q for word in ["thank", "thanks", "appreciate"]):
        return "😊 You're welcome! Feel free to ask any other questions about our services."
    
    if any(word in q for word in ["service", "offer", "provide", "capability", "do you offer"]):
        return "🛠️ **Our Services**:\n1. **PLC Programming** - Custom logic controllers\n2. **Robotic Automation** - End-to-end robotics\n3. **Smart Factory** - IoT & data solutions\n4. **AI Vision Systems** - Quality inspection\n5. **Consultancy** - Factory modernization\n\nWhich interests you?"
    
    return "🤔 Great question! For more specific information, please contact our team:\n📱 WhatsApp: +91 97025 15105\n📧 Email: contact@shivam-ai.com\n\nOr fill out the contact form on this page!"


@app.route("/health", methods=["GET", "OPTIONS"])
def health():
    if request.method == "OPTIONS":
        return "", 204
    return jsonify({
        "status": "healthy",
        "service": "Shivam AI Chatbot API",
        "ai_enabled": AI_ENABLED,
        "mode": "Gemini API" if AI_ENABLED else "Local Fallback"
    }), 200


@app.route("/chat", methods=["POST", "OPTIONS"])
def chat():
    if request.method == "OPTIONS":
        return "", 204
    
    try:
        data = request.json
        if not data:
            return jsonify({"reply": "No JSON data provided"}), 400
        
        user_message = data.get("message", "").strip()
        if not user_message:
            return jsonify({"reply": "Message is required"}), 400

        print(f"📨 User: {user_message}")
        
        # Try AI if enabled
        if AI_ENABLED:
            try:
                system_prompt = """
                You are 'Shivam AI Assistant', a professional industrial automation expert.
                RULES:
                1. BE CONCISE: Use max 2-3 sentences. Use bullet points for features.
                2. USE IMAGES: Use these markdown images when relevant:
                   - For Robotics/Automation: ![Robotics](images/kinematic-sync.jpg)
                   - For AI Vision/Inspection: ![AI Vision](images/vision-transformer.jpg)
                   - For General Industrial: ![Factory](images/industrial1.jpg)
                3. TONE: Professional, futuristic, and helpful.
                """
                prompt = f"{system_prompt}\nUser Question: {user_message}"
                response = model.generate_content(prompt)
                reply = response.text if response.text else None
                
                print(f"✅ AI Response: {reply[:80] if reply else 'None'}...")
                if reply:
                    return jsonify({"reply": reply, "status": "success", "mode": "gemini"}), 200
            except Exception as e:
                print(f"⚠️ AI Error: {str(e)}")
                # Fall through to local response
        
        # Use local fallback
        reply = get_local_response(user_message)
        print(f"✅ Local Response: {reply[:80]}...")
        return jsonify({"reply": reply, "status": "success", "mode": "local"}), 200
    
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return jsonify({"reply": f"Error: {str(e)}"}), 500


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route("/upload-profile-picture", methods=["POST", "OPTIONS"])
def upload_profile_picture():
    if request.method == "OPTIONS": return "", 204
    
    email = request.form.get("email")
    if not email:
        return jsonify({"success": False, "message": "Email is required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"success": False, "message": "User not found"}), 404

    if 'file' not in request.files:
        return jsonify({"success": False, "message": "No file part"}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"success": False, "message": "No selected file"}), 400

    if file:
        filename = secure_filename(f"profile_{user.id}_{file.filename}")
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        # Public URL for the frontend
        public_url = f"http://localhost:5000/uploads/{filename}"
        
        # Update user record
        user.profile_pic = public_url
        db.session.commit()
        
        return jsonify({"success": True, "profile_pic": public_url}), 200
    
    return jsonify({"success": False, "message": "File upload failed"}), 500


@app.route("/remove-profile-picture", methods=["POST", "OPTIONS"])
def remove_profile_picture():
    if request.method == "OPTIONS": return "", 204
    
    data = request.json
    email = data.get("email")
    if not email:
        return jsonify({"success": False, "message": "Email is required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"success": False, "message": "User not found"}), 404

    # Remove the profile picture reference from the DB
    user.profile_pic = None
    db.session.commit()
    
    return jsonify({"success": True, "message": "Profile picture removed"}), 200


if __name__ == "__main__":
    print("🚀 Shivam AI Chatbot API starting...")
    print("📍 Running on http://localhost:5000")
    if AI_ENABLED:
        print("✅ Gemini API: ENABLED")
    else:
        print("⚠️ Gemini API: DISABLED - Using local fallback")
    app.run(debug=True, host="0.0.0.0", port=5000)