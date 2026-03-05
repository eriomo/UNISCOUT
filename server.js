import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, "dist")));

const PORT = process.env.PORT || 10000;
const GROQ_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

async function callAI(messages, maxTokens = 2000) {
  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.7,
      max_tokens: maxTokens,
    }),
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.choices[0].message.content;
}

/* AI SCHOOL SEARCH */
app.post("/api/search", async (req, res) => {
  try {
    const { query, profile } = req.body;

    const reply = await callAI([
      {
        role: "system",
        content: `
You are UniScout Global AI.
Return real universities worldwide.
Always include:
- Country
- Tuition (approximate)
- Acceptance rate (if known)
- Application deadline
- Why it matches student
- Scholarship options
Be accurate. No fake data.
Return in clean bullet format.
        `,
      },
      {
        role: "user",
        content: `
Student profile:
${JSON.stringify(profile)}

Search request:
${query}
        `,
      },
    ]);

    res.json({ results: reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* AI CHAT ADVISOR */
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    const messages = [
      {
        role: "system",
        content:
          "You are UniScout AI — elite global university strategist. Give direct, high-level advice. No fluff.",
      },
    ];

    if (history) {
      history.slice(-8).forEach((h) =>
        messages.push({
          role: h.role === "ai" ? "assistant" : "user",
          content: h.text,
        })
      );
    }

    messages.push({ role: "user", content: message });

    const reply = await callAI(messages);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* AI DOCUMENT GENERATOR */
app.post("/api/generate", async (req, res) => {
  try {
    const { type, content } = req.body;

    const reply = await callAI([
      {
        role: "system",
        content:
          "You are an elite academic writing AI. Produce powerful, authentic, non-generic content.",
      },
      {
        role: "user",
        content: `Generate a ${type} using this info:\n${content}`,
      },
    ]);

    res.json({ output: reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("*", (req, res) =>
  res.sendFile(join(__dirname, "dist", "index.html"))
);

app.listen(PORT, () => console.log("UniScout AI running"));
