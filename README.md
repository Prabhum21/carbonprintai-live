# 🌱 CarbonWise AI

> **An AI-powered sustainability platform** that helps individuals understand, track, and reduce their carbon footprint through personalized insights, intelligent recommendations, and actionable goals — powered by Google Gemini AI.

Built for **PromptWars 2026 — Main Challenge 3**.

---

## ✨ Features

- 🔢 **Carbon Footprint Calculator** — Estimate your carbon score based on transport, electricity usage, food habits, and waste generation
- 📊 **Personal Dashboard** — Visualize your carbon history with trend line charts, pie breakdowns, and bar charts via Recharts
- 🤖 **AI Eco Coach** — Powered by Google Gemini, get a personalized sustainability summary, actionable tips, and a 7-day green action plan
- 💬 **Chat with AI** — Ask CarbonWise anything about sustainability and get context-aware, personalized answers
- 🏆 **Challenges** — Browse and track sustainability challenges
- 🔐 **Google Authentication** — Secure login via Firebase Auth (Google Sign-In)
- ☁️ **Cloud Data Persistence** — Footprint records stored per-user in Firebase Firestore

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite 5, React Router v6 |
| UI Library | MUI (Material UI) v5, Recharts v2 |
| Backend | Node.js 20, Express.js 4 |
| AI Engine | Google Gemini API (`gemini-2.0-flash` + 5 fallback models) |
| Auth | Firebase Authentication (Google Sign-In) |
| Database | Firebase Firestore |
| Hosting | Firebase Hosting (frontend) |
| Backend Deployment | Google Cloud Run (`asia-south1`) |
| Containerization | Docker (node:20-slim) |

---

## 📚 Documentation

- [Security Policy](SECURITY.md)
- [Testing Guide](TESTING.md)
- [Contributing Guidelines](CONTRIBUTING.md)

---

## 📁 Project Structure

```
CarbonWise/
├── frontend/                   # React + Vite app
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx        # Landing page
│   │   │   ├── Login.jsx       # Google authentication page
│   │   │   ├── Calculator.jsx  # Multi-step carbon footprint form
│   │   │   ├── Dashboard.jsx   # Charts & history (Recharts)
│   │   │   ├── AIAdvisor.jsx   # Gemini AI advice + free-text chat
│   │   │   └── Challenges.jsx  # Sustainability challenges
│   │   ├── components/
│   │   │   ├── Navbar.jsx      # Top navigation bar
│   │   │   └── GoogleLogin.jsx # Google sign-in button
│   │   ├── firebase.js         # Firebase client SDK config
│   │   ├── App.jsx             # Route definitions
│   │   ├── main.jsx            # React entry point
│   │   └── index.css           # Global styles
│   ├── .env                    # Environment variables (gitignored)
│   ├── .env.example            # Template for env setup
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── backend/                    # Node.js Express API
│   ├── routes/
│   │   └── api.js              # /calculate & /advisor endpoints
│   ├── server.js               # Express server entry point
│   ├── Dockerfile              # Container definition for Cloud Run
│   ├── .env                    # Backend env variables (gitignored)
│   ├── .env.example
│   └── package.json
├── firebase.json               # Firebase Hosting config (serves frontend/dist)
├── .firebaserc                 # Firebase project binding
└── README.md
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites

- **Node.js** v20+
- **Firebase project** with Authentication and Firestore enabled — [Firebase Console](https://console.firebase.google.com/)
- **Google Gemini API Key** — get one free from [Google AI Studio](https://aistudio.google.com/)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/carbonwise.git
cd carbonwise
```

---

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
```

Fill in your values:

```env
# Firebase Project Credentials
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Backend URL (use localhost for local dev, Cloud Run URL for production)
VITE_API_URL=http://localhost:8080
VITE_BACKEND_URL=http://localhost:8080
```

Start the dev server:

```bash
npm run dev
# Runs on http://localhost:5173
```

---

### 3. Backend Setup

```bash
cd backend
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
```

```env
GEMINI_API_KEY=your_gemini_api_key
PORT=8080
```

Start the server:

```bash
npm start          # Production mode
npm run dev        # Development mode (nodemon hot-reload)
# Runs on http://localhost:8080
```

Verify it's working:

```bash
curl http://localhost:8080/health
# Expected: {"status":"ok"}
```

---

## 🔌 API Reference

**Production Base URL:** `https://carbonwise-api-201203343594.asia-south1.run.app`  
**Local Base URL:** `http://localhost:8080`

---

### `GET /health`

Health check.

```json
{ "status": "ok" }
```

---

### `POST /api/calculate`

Calculate a carbon footprint score server-side.

**Request:**
```json
{
  "transport": "car",
  "electricity": 150,
  "food": "mixed",
  "waste": "medium"
}
```

**Response:**
```json
{ "score": 197.5 }
```

---

### `POST /api/advisor`

Get AI-generated sustainability advice from Google Gemini.

**Profile Analysis Mode:**
```json
{
  "transport": "car",
  "electricity": 150,
  "food": "mixed",
  "waste": "medium"
}
```

**Response:**
```json
{
  "score": 197.5,
  "summary": "Your carbon footprint is moderate...",
  "tips": ["tip1", "tip2", "tip3", "tip4"],
  "weeklyPlan": [
    "Monday: Use public transport",
    "Tuesday: Reduce electricity...",
    "..."
  ]
}
```

**Free-text Chat Mode:**
```json
{
  "query": "How can I reduce my electricity usage?"
}
```

**Response:**
```json
{ "response": "Here are some great ways to reduce electricity..." }
```

---

### Carbon Score Breakdown

| Category | Option | Score |
|----------|--------|-------|
| Transport | Bike | 10 |
| | Train | 25 |
| | Bus | 30 |
| | Car | 70 |
| | Flight | 100 |
| Food | Vegetarian | 20 |
| | Mixed | 50 |
| | Non-vegetarian | 80 |
| Waste | Low | 10 |
| | Medium | 30 |
| | High | 50 |
| Electricity | Per kWh | × 0.85 |

**Score Rating:**

| Score | Rating |
|-------|--------|
| < 100 | 🌿 Excellent |
| 100–199 | 🌱 Good |
| 200–299 | ⚠️ Average |
| 300+ | 🔥 High Impact |

---

## 🤖 Gemini AI — Model Fallback Strategy

The backend automatically tries Gemini models in priority order, falling back to the next if one fails or is unavailable:

1. `gemini-2.0-flash` ← primary
2. `gemini-2.0-flash-lite`
3. `gemini-1.5-flash`
4. `gemini-1.5-flash-latest`
5. `gemini-1.0-pro`
6. `gemini-pro`

If **all models fail**, a smart rule-based fallback response is returned using the user's actual data (transport type, food habits, score) so the app always remains functional.

---

## ☁️ Deployment

### Firebase Setup (One-time)

```bash
npm install -g firebase-tools
firebase login
firebase use carbonwise-ai-demo   # or: firebase use --add
```

Enable in Firebase Console:
- **Authentication** → Sign-in method → Google ✅
- **Firestore Database** → Create database (Production mode) ✅

**Firestore Security Rules** (minimum required):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /footprints/{doc} {
      allow read, write: if request.auth != null
                         && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```

---

### Backend — Google Cloud Run

The backend is containerized with Docker and deployed to Cloud Run in `asia-south1`.

```bash
cd backend

# Build and push container image
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/carbonwise-backend

# Deploy to Cloud Run
gcloud run deploy carbonwise-api \
  --image gcr.io/YOUR_PROJECT_ID/carbonwise-backend \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_gemini_api_key
```

**Live backend URL:**
```
https://carbonwise-api-201203343594.asia-south1.run.app
```

Verify deployment:
```bash
curl https://carbonwise-api-201203343594.asia-south1.run.app/health
# Expected: {"status":"ok"}
```

---

### Frontend — Firebase Hosting

After the backend is deployed, update `frontend/.env` to point to Cloud Run:

```env
VITE_API_URL=https://carbonwise-api-201203343594.asia-south1.run.app
VITE_BACKEND_URL=https://carbonwise-api-201203343594.asia-south1.run.app
```

Then build and deploy:

```bash
cd frontend
npm run build          # Outputs to frontend/dist/

cd ..
firebase deploy --only hosting
```

**Live frontend URL** will be shown after deploy, e.g.:
```
https://carbonwise-ai-demo.web.app
```

---

### Full Deployment Checklist

- [ ] Gemini API key set in Cloud Run env vars
- [ ] Firebase Authentication → Google sign-in enabled
- [ ] Firestore database created with security rules applied
- [ ] `VITE_API_URL` in `frontend/.env` points to Cloud Run URL
- [ ] `npm run build` completed successfully
- [ ] `firebase deploy --only hosting` completed
- [ ] Health check returns `{"status":"ok"}`
- [ ] Test: Calculator → saves to Firestore
- [ ] Test: AI Advisor → returns Gemini response
- [ ] Test: Dashboard → loads records from Firestore

---

## 🛡️ Environment Variables Reference

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Firebase Web API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase App ID |
| `VITE_FIREBASE_MEASUREMENT_ID` | Firebase Analytics measurement ID |
| `VITE_API_URL` | Backend base URL (Cloud Run or localhost) |
| `VITE_BACKEND_URL` | Fallback backend URL |

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Google Gemini API key from AI Studio |
| `PORT` | Server port (default: `8080`) |

---

## 📜 License

This project was built for PromptWars 2026. Feel free to fork and build upon it.
