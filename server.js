import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());
app.use(express.static(join(__dirname, 'dist')));

const GROQ_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

async function callGroq(messages, maxTokens = 1500) {
  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_KEY}`,
    },
    body: JSON.stringify({ model: MODEL, messages, max_tokens: maxTokens, temperature: 0.7 }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.choices[0].message.content;
}

// AI ADVISOR CHAT
app.post('/api/chat', async (req, res) => {
  try {
    const { message, profile, history } = req.body;
    const systemPrompt = `You are UniScout AI Advisor — a friendly, expert university admissions counselor helping students find universities worldwide.

RULES:
- Give direct, actionable advice. No fluff.
- Mention specific tuition costs, deadlines, acceptance rates when you know them.
- Always warn against paid agents — students can apply directly.
- Keep responses concise but thorough. Use emojis and formatting for readability.
- If you don't know something, say so honestly.
- Tailor advice to the student's profile when available.

${profile && profile.name ? `STUDENT PROFILE:
- Name: ${profile.name || 'N/A'}
- Course: ${profile.course || 'N/A'}
- Country preference: ${profile.country || 'N/A'}
- Budget: ${profile.budget || 'N/A'}
- Education level: ${profile.level || 'N/A'}
- GPA: ${profile.gpa || 'N/A'}
- Nationality: ${profile.nationality || 'N/A'}
- Skills: ${profile.skills || 'N/A'}
- Experience: ${profile.experience || 'N/A'}` : 'No profile provided yet.'}

KNOWN SCHOOLS (reference when relevant):
- University of Toronto (Canada) — #21, $45,690 CAD/yr, 43% acceptance
- University of Melbourne (Australia) — #33, $42,000 AUD/yr, 70% acceptance
- TU Munich (Germany) — #37, FREE tuition (€144/semester), 8% acceptance
- University of Cape Town (South Africa) — #160, ~$3,500-$5,100 USD/yr, 56% acceptance
- University of Edinburgh (UK) — #22, £26,500-£34,800/yr, 37% acceptance
- NUS Singapore — #8, S$37,550/yr, 6% acceptance
- ETH Zurich (Switzerland) — #7, ~$1,600 USD/yr, 27% acceptance
- UBC Vancouver (Canada) — #35, $42,800 CAD/yr, 52% acceptance

KNOWN SCHOLARSHIPS:
- Chevening (UK) — Full ride, needs 2+ years work exp
- DAAD (Germany) — €934/month + travel
- Mastercard Foundation — Full ride for African students
- Fulbright (USA) — Full funding
- Commonwealth Scholarships — Full tuition + flights
- Erasmus Mundus (Europe) — €1,400/mo + tuition
- Gates Cambridge — Full cost at Cambridge
- Lester B. Pearson (Canada) — 4-year full ride at U of Toronto`;

    const msgs = [{ role: 'system', content: systemPrompt }];
    if (history && history.length) {
      history.slice(-10).forEach(h => {
        msgs.push({ role: h.role === 'ai' ? 'assistant' : 'user', content: h.text });
      });
    }
    msgs.push({ role: 'user', content: message });

    const reply = await callGroq(msgs);
    res.json({ reply });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// AI LETTER GENERATOR
app.post('/api/letter', async (req, res) => {
  try {
    const { type, name, school, program, background, why, strengths } = req.body;
    const typeLabel = type === 'motivation' ? 'Motivation Letter' : type === 'cover' ? 'Cover Letter' : 'Personal Statement / Statement of Purpose';

    const reply = await callGroq([
      { role: 'system', content: `You are an expert academic writing assistant. Write a compelling ${typeLabel} for university admission. Write in first person. Be authentic, specific, and persuasive. Do NOT use generic filler — every sentence should add value. Output ONLY the letter text, no extra commentary. The letter should be 400-600 words.` },
      { role: 'user', content: `Write a ${typeLabel} with these details:
- Name: ${name || '[Name]'}
- Target school: ${school || '[University]'}
- Program: ${program || '[Program]'}
- Background/education: ${background || 'Not specified'}
- Why this school: ${why || 'Not specified'}
- Key strengths/skills: ${strengths || 'Not specified'}` }
    ], 2000);
    res.json({ letter: reply });
  } catch (err) {
    console.error('Letter error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// AI RESUME IMPROVER
app.post('/api/resume', async (req, res) => {
  try {
    const { name, summary, education, experience, skills, achievements } = req.body;
    const reply = await callGroq([
      { role: 'system', content: `You are an expert resume writer for academic/university applications. The student will give you their raw resume info. Rewrite and improve it to be more impactful, using strong action verbs and quantified results where possible. Return it in clean sections: SUMMARY, EDUCATION, EXPERIENCE, SKILLS, ACHIEVEMENTS. Output ONLY the improved text, no commentary.` },
      { role: 'user', content: `Improve this resume:
Name: ${name}
Summary: ${summary || 'None'}
Education: ${education || 'None'}
Experience: ${experience || 'None'}
Skills: ${skills || 'None'}
Achievements: ${achievements || 'None'}` }
    ], 2000);
    res.json({ improved: reply });
  } catch (err) {
    console.error('Resume error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Catch-all for client-side routing
app.get('*', (req, res) => res.sendFile(join(__dirname, 'dist', 'index.html')));

app.listen(process.env.PORT || 10000, () => console.log('UniScout running'));
