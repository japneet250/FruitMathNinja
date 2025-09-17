from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import os
from datetime import datetime, timezone

app = Flask(__name__)
CORS(app)

# ---------------- MongoDB Setup ----------------
MONGO_URI = os.environ.get("MONGO_URI") or "mongodb+srv://singj93_db_user:qA68loPdRPsRAPmo@cluster0.nlwncx7.mongodb.net/mathninja?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGO_URI)
db = client['math_fruit_ninja']  # Database
users_collection = db['users']   # Collection for users
scores_collection = db['scores'] # Collection for game scores

@app.route('/')
def home():
    return "Math Fruit Ninja Backend is running!"

from datetime import datetime

# ------------------- USER API -------------------

# Register or login user
@app.route('/api/user', methods=['POST'])
def register_or_login_user():
    """
    Request JSON:
    {
        "username": "Japneet"
    }
    Response JSON:
    {
        "success": True,
        "user": { "_id": "abc123", "username": "Japneet", "created_at": "2025-09-13" }
    }
    """
    data = request.get_json()
    username = data.get("username")

    if not username:
        return jsonify({"success": False, "message": "Username is required"}), 400

    # Check if user exists
    user = users_collection.find_one({"username": username})
    if not user:
        # Create new user
        new_user = {
            "username": username,
            "created_at": datetime.utcnow()
        }
        result = users_collection.insert_one(new_user)
        new_user["_id"] = str(result.inserted_id)
        return jsonify({"success": True, "user": new_user})

    # Existing user
    user["_id"] = str(user["_id"])
    return jsonify({"success": True, "user": user})

# ------------------- SCORE API -------------------

@app.route('/api/score', methods=['POST'])
def submit_score():
    data = request.get_json()
    username = data.get("username")
    score = data.get("score")
    lives = data.get("lives", 0)
    timeLeft = data.get("timeLeft", 0)
    maxCombo = data.get("maxCombo", 0)
    accuracy = data.get("accuracy", 0)
    powerUpsUsed = data.get("powerUpsUsed", 0)
    difficulty = data.get("difficulty", "Medium")

    if not username or score is None:
        return jsonify({"success": False, "message": "Username and score required"}), 400

    new_score = {
        "username": username,
        "score": score,
        "lives": lives,
        "timeLeft": timeLeft,
        "maxCombo": maxCombo,
        "accuracy": accuracy,
        "powerUpsUsed": powerUpsUsed,
        "difficulty": difficulty,
        "date": datetime.now(timezone.utc)
    }

    scores_collection.insert_one(new_score)
    return jsonify({"success": True, "message": "Score saved!"})



# --- Get top scores for leaderboard ---
@app.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    # Sort scores descending and get top 3
    top_scores = list(scores_collection.find().sort("score", -1).limit(3))
    
    # Convert ObjectId and datetime to string for JSON
    result = []
    for s in top_scores:
        result.append({
            "username": s['username'],
            "score": s['score'],
            "date": s['date'].strftime("%Y-%m-%d %H:%M:%S")
        })
    return jsonify(result), 200


if __name__ == '__main__':
    app.run(debug=True)

