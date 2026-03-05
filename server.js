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
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_KEY}` },
    body: JSON.stringify({ model: MODEL, messages, max_tokens: maxTokens, temperature: 0.7 }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || 'Groq API error');
  return data.choices[0].message.content;
}

app.post('/api/chat', async (req, res) => {
  try {
    const { message, profile, history } = req.body;
    const sys = `You are UniScout AI Advisor — a friendly expert university admissions counselor helping students find universities worldwide.
RULES: Direct actionable advice. Mention specific costs, deadlines, acceptance rates. Warn against paid agents. Concise but thorough. Use emojis. Be honest when unsure. Tailor to student profile. You can recommend ANY university worldwide.
${profile && profile.name ? `STUDENT: ${profile.name}, wants ${profile.course||'undecided'}, prefers ${profile.country||'any'}, budget ${profile.budget||'unspecified'}, level ${profile.level||'N/A'}, GPA ${profile.gpa||'N/A'}, from ${profile.nationality||'N/A'}, skills: ${profile.skills||'N/A'}` : ''}
SCHOLARSHIPS: Chevening(UK full ride), DAAD(Germany), Mastercard Foundation(Africa), Fulbright(USA), Commonwealth(UK), Erasmus Mundus(EU), Gates Cambridge, Pearson(Canada)`;
    const msgs = [{ role: 'system', content: sys }];
    if (history) history.slice(-10).forEach(h => msgs.push({ role: h.role === 'ai' ? 'assistant' : 'user', content: h.text }));
    msgs.push({ role: 'user', content: message });
    res.json({ reply: await callGroq(msgs) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/letter', async (req, res) => {
  try {
    const { type, name, school, program, background, why, strengths } = req.body;
    const label = type === 'motivation' ? 'Motivation Letter' : type === 'cover' ? 'Cover Letter' : 'Statement of Purpose';
    const reply = await callGroq([
      { role: 'system', content: `Write compelling ${label}s for university admission. First person, authentic, specific. No filler. 400-600 words. Output ONLY the letter.` },
      { role: 'user', content: `${label} for:\nName: ${name||'[Name]'}\nSchool: ${school||'[University]'}\nProgram: ${program||'[Program]'}\nBackground: ${background||'N/A'}\nWhy: ${why||'N/A'}\nStrengths: ${strengths||'N/A'}` }
    ], 2000);
    res.json({ letter: reply });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/resume', async (req, res) => {
  try {
    const { name, summary, education, experience, skills, achievements } = req.body;
    const reply = await callGroq([
      { role: 'system', content: `Expert resume writer for university apps. Rewrite with action verbs and quantified results. Sections: SUMMARY, EDUCATION, EXPERIENCE, SKILLS, ACHIEVEMENTS. Output ONLY improved text.` },
      { role: 'user', content: `Improve:\nName: ${name}\nSummary: ${summary||''}\nEducation: ${education||''}\nExperience: ${experience||''}\nSkills: ${skills||''}\nAchievements: ${achievements||''}` }
    ], 2000);
    res.json({ improved: reply });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('*', (req, res) => res.sendFile(join(__dirname, 'dist', 'index.html')));
app.listen(process.env.PORT || 10000, () => console.log('UniScout running'));
