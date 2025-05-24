# 🧠 Symptom-Based Medical Diagnosis Chatbot using RAG and Machine Learning

Welcome to the future of AI-powered healthcare! This project is a smart, conversational **medical assistant chatbot** that predicts diseases based on symptoms, suggests home remedies, prescriptions, diet plans, and even supports image-based diagnosis.

---

## 🚀 Features

- 🩺 Symptom-based disease prediction using ML (Regression/LSTM)
- 🧾 Home remedies, prescriptions, and diet plan generation
- 📸 Image-based diagnosis via AI vision models (LLaVA / GROQ API)
- 💬 Chatbot interface with session-based conversation history
- 📚 RAG (Retrieval-Augmented Generation) for intelligent answers
- 🧠 MongoDB vector search for semantic document retrieval
- 🌐 MERN + Python + FastAPI powered full stack

---

## 🛠️ Tech Stack

| Layer        | Technology Used                                   |
| ------------ | ------------------------------------------------- |
| 🧩 Frontend  | React.js, Tailwind CSS                            |
| 🔗 Backend   | Node.js, Express.js, Python (Flask / FastAPI)     |
| 🧠 ML Models | Regression, LSTM, Vision-Language APIs            |
| 💬 AI Search | Embedding + RAG using MongoDB Atlas Vector Search |
| 🗃️ Database  | MongoDB Atlas                                     |

---

## 📁 Project Structure

```bash
Symptoms-Medical-Chatbot/
├── frontend/ # React frontend
├── backend/ # Node.js + Express backend
├── al-model/ # Python ML models for prediction
└── README.md
```

---

## 🔄 Chatbot Workflow

1. **User enters symptoms** via chat.
2. **ML model predicts** the disease (minor or major).
3. If minor, bot asks if user wants:
   - 💊 Prescription
   - 🏠 Home remedies
   - 🥗 Diet plan
   - 👨‍⚕️ Doctor consult
4. If major, user is advised to consult a doctor.
5. Optionally, users can **upload an image** for diagnosis.

---

## 🧠 ML + RAG Magic

- 🔍 Converts documents into embeddings and stores in MongoDB vector index.
- 📖 Performs semantic search on user query.
- 🧠 Uses RAG to provide context-aware answers based on vector similarity.

---

## 🖼️ Image Analysis

- Upload medical images (e.g., rashes, wounds).
- Processed by image-to-text model via FastAPI.
- Text response fed back into the chatbot flow.

---

## 🧪 Local Setup

1. **Clone the repo:**

```bash
git clone https://github.com/Sathish14325/Symptoms-Medical-Chatbot.git
cd Symptoms-Medical-Chatbot
```

2. **Frontend Setup:**

```bash
cd frontend
npm install
npm run dev
```

3. **Backend Setup:**

```bash
cd backend
npm install
npm run start
```

4. **ML Service Setup (Python):**

```bash
cd al-model
pip install -r requirements.txt
python app.py
```

**📜 License**

MIT License — Feel free to fork, modify, and build on it!
