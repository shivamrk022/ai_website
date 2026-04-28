import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("ERROR: GOOGLE_API_KEY not found")
else:
    try:
        genai.configure(api_key=api_key)
        # Trying the 'latest' alias
        model = genai.GenerativeModel("gemini-1.5-flash-latest")
        response = model.generate_content("Hello")
        print(f"SUCCESS: {response.text}")
    except Exception as e:
        print(f"ERROR: {str(e)}")
