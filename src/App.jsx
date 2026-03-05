import { useState, useEffect } from "react";

const API = "";

function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "linear-gradient(135deg,#2563eb,#7c3aed)",
        }}
      />
      <strong>UniScout</strong>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("login");
  const [view, setView] = useState("search");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  function login(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
  }

  function logout() {
    localStorage.removeItem("user");
    setUser(null);
  }

  async function searchAI() {
    const res = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: input, profile: user }),
    });
    const data = await res.json();
    setOutput(data.results);
  }

  async function chatAI() {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input, history: chat }),
    });
    const data = await res.json();
    setChat([...chat, { role: "user", text: input }, { role: "ai", text: data.reply }]);
    setInput("");
  }

  if (!user) {
    return (
      <div style={authWrapper}>
        <div style={authCard}>
          <Logo />
          <h2>{mode === "login" ? "Login" : "Sign Up"}</h2>
          <form onSubmit={login} style={{ width: "100%" }}>
            <input name="name" placeholder="Name" required style={inputStyle} />
            <input name="email" placeholder="Email" required style={inputStyle} />
            <input type="password" name="password" placeholder="Password" required style={inputStyle} />
            <button style={buttonStyle}>Continue</button>
          </form>
          <p onClick={() => setMode(mode === "login" ? "signup" : "login")} style={{ cursor: "pointer" }}>
            {mode === "login" ? "Create account" : "Already have account"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={appWrapper}>
      <header style={headerStyle}>
        <Logo />
        <div>
          <button onClick={() => setView("search")} style={navBtn}>Search</button>
          <button onClick={() => setView("chat")} style={navBtn}>Advisor</button>
          <button onClick={logout} style={navBtn}>Logout</button>
        </div>
      </header>

      <main style={mainStyle}>
        <textarea
          style={textareaStyle}
          placeholder="Ask anything about universities worldwide..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        {view === "search" ? (
          <button style={buttonStyle} onClick={searchAI}>Search Universities</button>
        ) : (
          <button style={buttonStyle} onClick={chatAI}>Ask Advisor</button>
        )}
        <div style={outputStyle}>
          {view === "search"
            ? output
            : chat.map((c, i) => (
                <div key={i}>
                  <strong>{c.role === "user" ? "You" : "AI"}:</strong>
                  <p>{c.text}</p>
                </div>
              ))}
        </div>
      </main>
    </div>
  );
}

/* STYLES */

const authWrapper = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 20,
  background: "#f3f4f6",
};

const authCard = {
  width: "100%",
  maxWidth: 400,
  background: "#fff",
  padding: 30,
  borderRadius: 12,
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 16,
};

const appWrapper = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 20px",
  borderBottom: "1px solid #ddd",
};

const mainStyle = {
  flex: 1,
  padding: 20,
  display: "flex",
  flexDirection: "column",
  gap: 16,
};

const inputStyle = {
  width: "100%",
  padding: 10,
  marginBottom: 10,
  borderRadius: 8,
  border: "1px solid #ccc",
};

const textareaStyle = {
  width: "100%",
  minHeight: 120,
  padding: 12,
  borderRadius: 8,
  border: "1px solid #ccc",
  resize: "vertical",
};

const buttonStyle = {
  padding: 12,
  borderRadius: 8,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  cursor: "pointer",
};

const navBtn = {
  marginLeft: 10,
  padding: 8,
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
};

const outputStyle = {
  whiteSpace: "pre-wrap",
};
