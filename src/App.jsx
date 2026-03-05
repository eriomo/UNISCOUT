import { useState } from "react";

export default function App() {
  const [user, setUser] = useState(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  async function sendMessage() {
    if (!input) return;

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();

    setMessages([
      ...messages,
      { role: "user", text: input },
      { role: "ai", text: data.reply },
    ]);

    setInput("");
  }

  if (!user) {
    return (
      <div style={styles.authContainer}>
        <div style={styles.authBox}>
          <h1 style={styles.logo}>UniScout</h1>
          <input
            placeholder="Email"
            style={styles.input}
          />
          <input
            placeholder="Password"
            type="password"
            style={styles.input}
          />
          <button style={styles.button} onClick={() => setUser(true)}>
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.logoSmall}>UniScout</h2>
        <button onClick={() => setUser(null)} style={styles.logout}>
          Logout
        </button>
      </header>

      <div style={styles.chatBox}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={
              m.role === "user" ? styles.userMsg : styles.aiMsg
            }
          >
            {m.text}
          </div>
        ))}
      </div>

      <div style={styles.inputRow}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search universities worldwide..."
          style={styles.inputFlex}
        />
        <button onClick={sendMessage} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    fontFamily: "Arial",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 20px",
    background: "#111",
    color: "#fff",
  },
  logo: {
    fontSize: "32px",
    textAlign: "center",
  },
  logoSmall: {
    fontSize: "18px",
  },
  logout: {
    background: "#444",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
  },
  chatBox: {
    flex: 1,
    padding: "15px",
    overflowY: "auto",
  },
  userMsg: {
    textAlign: "right",
    marginBottom: "10px",
  },
  aiMsg: {
    textAlign: "left",
    marginBottom: "10px",
  },
  inputRow: {
    display: "flex",
    padding: "10px",
  },
  inputFlex: {
    flex: 1,
    padding: "10px",
  },
  button: {
    padding: "10px 15px",
  },
  authContainer: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  authBox: {
    width: "90%",
    maxWidth: "400px",
    display: "flex",
    flexDirection: "column",
  },
  input: {
    marginBottom: "10px",
    padding: "10px",
  },
};
