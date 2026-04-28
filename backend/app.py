from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app, origins="*", methods=["GET", "POST", "OPTIONS"], allow_headers=["Content-Type"])

api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    print("⚠️ GOOGLE_API_KEY not found in .env - Using local chatbot only")
    api_key = None

if api_key:
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-1.5-flash")
        AI_ENABLED = True
    except Exception as e:
        print(f"⚠️ Could not initialize Gemini: {e}")
        AI_ENABLED = False
else:
    AI_ENABLED = False


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
                prompt = f"You are an industrial automation AI expert for Shivam AI Automation. Answer this query: {user_message}"
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


if __name__ == "__main__":
    print("🚀 Shivam AI Chatbot API starting...")
    print("📍 Running on http://localhost:5000")
    if AI_ENABLED:
        print("✅ Gemini API: ENABLED")
    else:
        print("⚠️ Gemini API: DISABLED - Using local fallback")
    app.run(debug=True, host="0.0.0.0", port=5000)