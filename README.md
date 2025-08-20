# 🎙️ Real-time Audio Transcription with Gemini + WebSockets

This project is a Node.js server that captures audio from the client, streams it via WebSocket, and processes it using **Google's Gemini API** for transcription and conversation.  
The AI is restricted to talk only about **Revolt Motors** (electric motorcycles, company info, features, etc).  

---

## 🚀 Features
- Real-time WebSocket server for audio streaming  
- Audio transcription using Gemini (`gemini-2.5-flash-preview-05-20`)  
- AI assistant restricted to Revolt Motors  
- `.env` support for secure API keys  
- Static frontend support from `/public`  

---

## 📦 Setup Instructions

### 1. Clone the repo
```
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```
### 2. Install dependencies 
```
npm install
```

### 3. Create .env file

Inside the project root, create a .env file and add:
```
PORT=3000
GEMINI_API_KEY=your_api_key_here
```

⚠️ Note: .env is ignored via .gitignore and should never be pushed to GitHub.

### 4. Start the server
```
npm run start
```
Server will run on:
👉 http://localhost:3000

### 5. Client-side

Place your frontend code (HTML/JS/CSS) in the /public folder

Example: use navigator.mediaDevices.getUserMedia() to record audio and send to WebSocket

🛑 Important Notes

+ If you accidentally pushed .env earlier, run:
```
git rm --cached .env
git commit -m "Remove .env from repo"
git push origin main
```

+ Then regenerate your Gemini API key from Google AI Studio.