import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("❌ GOOGLE_API_KEY not found")
else:
    try:
        genai.configure(api_key=api_key)
        # Using a safer model name for wide compatibility
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content("Hello, are you working?")
        print(f"✅ Success! Response: {response.text}")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
