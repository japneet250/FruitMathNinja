## 🚀 Getting Started

### 1. Frontend

```bash
cd frontend
npm install
npm run dev
```
- Runs the React app locally (usually on `http://localhost:5173`).

### 2. Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```
- Runs Flask/FastAPI server on `http://localhost:5000` (adjust port if needed).  
- Connects to MongoDB and validates Firebase tokens for secure API calls.  

### 3. MongoDB Setup
- Configure your MongoDB URI in `backend/config.py` or `.env`.  
- Ensure collections: `users`, `scores`, `achievements`.

---

## 🌍 How It Works

1. User signs up or logs in via **Firebase Auth**.  
2. React frontend tracks hand gestures in real time using **MediaPipe**.  
3. Fruits appear with math answers — slice the correct ones to earn points.  
4. Game progress and scores are sent to **Flask/FastAPI**, validated, and stored in **MongoDB**.  
5. Leaderboard and achievements are fetched and displayed dynamically.  

---

## 🎯 Why It’s Cool

- **Hands-Free Gameplay**: Minimal hardware needed — just a webcam.  
- **ML-Powered Interaction**: AI tracks gestures in real time for immersive gameplay.  
- **Gamified Learning**: Math practice feels like a fast-paced arcade game.  
- **Full-Stack Integration**: React frontend ↔ Flask backend ↔ MongoDB storage ↔ Firebase Auth.  

---

## 📚 Next Steps

- Add fractions, algebra, and geometry quizzes.  
- Real-time multiplayer mode.  
- Mobile deployment with AR-style slicing.  
- Analytics dashboard for teachers/parents.
