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

async function callGroqJSON(messages, maxTokens = 3000) {
  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_KEY}` },
    body: JSON.stringify({ model: MODEL, messages, max_tokens: maxTokens, temperature: 0.4, response_format: { type: 'json_object' } }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || 'Groq API error');
  return JSON.parse(data.choices[0].message.content);
}

// CHAT ADVISOR
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
    res.json({ reply: await callGroq(msgs, 1500) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// LETTER DRAFTER
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

// RESUME IMPROVER
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

// AI SCHOOL SEARCH
app.post('/api/schools/search', async (req, res) => {
  try {
    const { query, country, profile } = req.body;
    const profileCtx = profile ? `Student profile: course=${profile.course||'any'}, budget=${profile.budget||'any'}, level=${profile.level||'any'}, nationality=${profile.nationality||'any'}, GPA=${profile.gpa||'N/A'}, skills=${profile.skills||'N/A'}` : '';
    const data = await callGroqJSON([
      { role: 'system', content: `You are a university database. Return real universities matching the search. Always return JSON with key "schools" as an array. Each school must have ALL these exact fields: id (number), name, country, city, ranking (number, global QS rank), acceptance (string like "43%"), tuition (string), accommodation (string), textbooks (string), applicationFee (string), deadline (string like "Jan 15, 2026"), programs (array of strings), scholarships (number), description (string), payment (string), costOfLiving (string), partTime (string), email (string), phone (string), website (string), color (hex string like "#1E3A5F"), photo (single emoji), flag (country flag emoji), requirements (array of strings), textbookList (array of {name,price,req:boolean}), accommodationOptions (array of {name,type,price,meal,amenities,distance}), strengths (array of strings), climate (string), language (string), intlStudents (string like "25%"), employmentRate (string like "92%"). Return 6-8 real universities. Be accurate with real data.` },
      { role: 'user', content: `Search: "${query||'top universities'}", Country filter: "${country||'any'}". ${profileCtx}. Return 6-8 matching universities as JSON.` }
    ], 4000);
    res.json({ schools: data.schools || [] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// AI SCHOLARSHIPS SEARCH
app.post('/api/scholarships/search', async (req, res) => {
  try {
    const { query, country, profile } = req.body;
    const profileCtx = profile ? `Student: nationality=${profile.nationality||'any'}, level=${profile.level||'any'}, course=${profile.course||'any'}` : '';
    const data = await callGroqJSON([
      { role: 'system', content: `You are a scholarship database. Return real scholarships as JSON with key "scholarships" as array. Each must have: id (number), name, country, amount (string), deadline (string), website (string), email (string), eligibility (string), type (string like "Full Ride" or "Stipend"), programs (string). Return 8-12 real scholarships. Be accurate.` },
      { role: 'user', content: `Search: "${query||'all scholarships'}", Country: "${country||'any'}". ${profileCtx}. Return real matching scholarships as JSON.` }
    ], 3000);
    res.json({ scholarships: data.scholarships || [] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// AI VISA INFO
app.post('/api/visa', async (req, res) => {
  try {
    const { country, nationality } = req.body;
    const data = await callGroqJSON([
      { role: 'system', content: `You are a visa expert. Return accurate student visa info as JSON with this exact structure: { "type": string, "time": string, "cost": string, "funds": string, "docs": array of strings, "tips": string }. Be accurate and specific.` },
      { role: 'user', content: `Student visa requirements for studying in ${country}. Student nationality: ${nationality||'general/international'}. Return JSON.` }
    ], 1500);
    res.json({ visa: data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// AI CHECKLIST
app.post('/api/checklist', async (req, res) => {
  try {
    const { country, level, nationality } = req.body;
    const data = await callGroqJSON([
      { role: 'system', content: `You are a university admissions expert. Return a post-acceptance checklist as JSON with key "checklist" as array of strings. Each item is a clear action step. Return 12-16 practical steps in order. Be specific to the country.` },
      { role: 'user', content: `Post-acceptance checklist for studying in ${country}. Student level: ${level||'any'}. Nationality: ${nationality||'international'}. Return JSON.` }
    ], 1500);
    res.json({ checklist: data.checklist || [] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// AI RECOMMENDATIONS
app.post('/api/recommend', async (req, res) => {
  try {
    const { profile } = req.body;
    if (!profile || (!profile.course && !profile.country && !profile.skills)) {
      // No profile — return popular schools
      const data = await callGroqJSON([
        { role: 'system', content: `Return 6 top globally ranked universities as JSON with key "schools". Each school must have ALL these fields: id (number), name, country, city, ranking (number), acceptance (string), tuition, accommodation, textbooks, applicationFee, deadline, programs (array), scholarships (number), description, payment, costOfLiving, partTime, email, phone, website, color (hex), photo (emoji), flag (emoji), requirements (array), textbookList (array of {name,price,req:boolean}), accommodationOptions (array of {name,type,price,meal,amenities,distance}), strengths (array), climate, language, intlStudents, employmentRate.` },
        { role: 'user', content: 'Return 6 most popular universities for international students as JSON.' }
      ], 4000);
      return res.json({ schools: data.schools || [] });
    }
    const data = await callGroqJSON([
      { role: 'system', content: `You are a university matching engine. Return the best matching real universities as JSON with key "schools". Each school must have ALL these fields: id (number), name, country, city, ranking (number), acceptance (string), tuition, accommodation, textbooks, applicationFee, deadline, programs (array), scholarships (number), description, payment, costOfLiving, partTime, email, phone, website, color (hex), photo (emoji), flag (emoji), requirements (array), textbookList (array of {name,price,req:boolean}), accommodationOptions (array of {name,type,price,meal,amenities,distance}), strengths (array), climate, language, intlStudents, employmentRate. Return 6-8 best matches.` },
      { role: 'user', content: `Find best matching universities for: course=${profile.course||'any'}, preferred country=${profile.country||'any'}, budget=${profile.budget||'any'}, level=${profile.level||'any'}, GPA=${profile.gpa||'N/A'}, nationality=${profile.nationality||'any'}, skills=${profile.skills||'N/A'}, interests=${profile.interests||'N/A'}. Return 6-8 best matched universities as JSON.` }
    ], 4000);
    res.json({ schools: data.schools || [] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// AI SCHOOL DETAIL (for any school not in cache)
app.post('/api/school/detail', async (req, res) => {
  try {
    const { name, country } = req.body;
    const data = await callGroqJSON([
      { role: 'system', content: `Return detailed info for a real university as JSON with this exact structure: { id, name, country, city, ranking (number), acceptance, tuition, accommodation, textbooks, applicationFee, deadline, programs (array), scholarships (number), description, payment, costOfLiving, partTime, email, phone, website, color (hex), photo (emoji), flag (emoji), requirements (array), textbookList (array of {name,price,req:boolean}), accommodationOptions (array of {name,type,price,meal,amenities,distance}), strengths (array), climate, language, intlStudents, employmentRate }. Be accurate with real data.` },
      { role: 'user', content: `Full details for ${name}${country ? ', ' + country : ''}. Return JSON.` }
    ], 3000);
    res.json({ school: data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// AI COUNTRIES LIST
app.get('/api/countries', async (req, res) => {
  try {
    const data = await callGroqJSON([
      { role: 'system', content: 'Return a JSON object with key "countries" as array of country name strings that are popular for international university students.' },
      { role: 'user', content: 'List 20 most popular countries for international university students as JSON.' }
    ], 800);
    res.json({ countries: data.countries || [] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('*', (req, res) => res.sendFile(join(__dirname, 'dist', 'index.html')));
app.listen(process.env.PORT || 10000, () => console.log('UniScout running'));
