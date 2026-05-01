import psycopg2
import os
import time
import random
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

def simulate_industrial_data():
    db_url = os.getenv('DATABASE_URL')
    if not db_url:
        print("❌ DATABASE_URL not found in .env")
        return

    try:
        conn = psycopg2.connect(db_url)
        conn.autocommit = True
        cur = conn.cursor()
        
        print("🚀 Industrial Simulator Started! (Press Ctrl+C to stop)")
        print("📊 Sending live data to 'industrial_logs' table...")

        event_types = ["PLC_STATUS", "SENSOR_READING", "SYSTEM_ALERT", "NODE_HEARTBEAT"]
        locations = ["Zone A", "Zone B", "Assembly Line 1", "Robotic Cell 4"]

        while True:
            event = random.choice(event_types)
            location = random.choice(locations)
            
            if event == "SENSOR_READING":
                temp = round(random.uniform(20.0, 85.0), 2)
                pressure = round(random.uniform(1.0, 10.0), 2)
                message = f"[{location}] Temperature: {temp}°C, Pressure: {pressure} bar"
            elif event == "PLC_STATUS":
                status = random.choice(["RUNNING", "IDLE", "MAINTENANCE"])
                message = f"[{location}] PLC status changed to {status}"
            elif event == "SYSTEM_ALERT":
                message = f"⚠️ CRITICAL: Unexpected vibration detected in {location}!"
            else:
                message = f"[{location}] System heartbeat pulse OK."

            # Insert into industrial_logs table
            query = "INSERT INTO industrial_logs (event_type, message, timestamp) VALUES (%s, %s, %s)"
            cur.execute(query, (event, message, datetime.now()))
            
            print(f"✅ Sent: {event} | {message}")
            
            # Wait for 5 seconds before next log
            time.sleep(5)

    except KeyboardInterrupt:
        print("\n🛑 Simulator stopped.")
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    simulate_industrial_data()
