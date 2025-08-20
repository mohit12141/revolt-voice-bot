// server.js
import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" });

app.use(express.static("public"));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("🔗 Client connected");

  let audioChunks = [];

  ws.on("message", async (msg) => {
    // If client says STOP → process audio
    if (msg.toString() === "STOP") {
      console.log("🛑 Received STOP signal, processing audio...");

      if (audioChunks.length === 0) {
        ws.send(JSON.stringify({ error: "No audio recorded" }));
        return;
      }

      try {
        const audioBuffer = Buffer.concat(audioChunks);
        const base64Audio = audioBuffer.toString("base64");

        const result = await model.generateContent({
          contents: [
            {
                role: "user",
                parts: [
                    {
                    text: "You are an AI assistant that only talks about Revolt Motors (electric motorcycles, company info, features, etc). If asked anything unrelated, politely steer the conversation back to Revolt Motors."
                    }
                ]
            },
            {
              role: "user",
              parts: [
                {
                  inlineData: {
                    mimeType: "audio/webm", // must match client recording
                    data: base64Audio,
                  },
                },
              ],
            },
          ],
        });

        const text = result.response.text();
        console.log("📝 Final Transcription:", text);

        ws.send(JSON.stringify({ text })); // ✅ Send back before closing
      } catch (err) {
        console.error("❌ Error:", err);
        ws.send(JSON.stringify({ error: err.message }));
      }
    } else {
      // Otherwise → collect audio chunks
      audioChunks.push(Buffer.from(msg));
      console.log(`🎧 Received chunk (${msg.byteLength} bytes), total: ${audioChunks.length}`);
    }
  });

  ws.on("close", () => {
    console.log("❌ Client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
