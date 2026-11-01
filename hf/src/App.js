import React, { useState } from 'react';
import './App.css';

const HARNESS_ENDPOINT =
  process.env.REACT_APP_HARNESS_ENDPOINT || 'TBD';

function App() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = prompt.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setPrompt('');
    if (HARNESS_ENDPOINT === 'TBD') {
      setMessages((prev) => [
        ...prev,
        { role: 'agent', text: 'Harness endpoint not configured yet.' },
      ]);
      return;
    }
    fetch(HARNESS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: trimmed }),
    })
      .then((response) => response.json())
      .then((data) => {
        setMessages((prev) => [
          ...prev,
          { role: 'agent', text: data?.reply || 'No response.' },
        ]);
      })
      .catch(() => {
        setMessages((prev) => [
          ...prev,
          { role: 'agent', text: 'Failed to reach harness.' },
        ]);
      });
  };

  return (
    <main className="app-shell">
      <section className="agent-panel" aria-labelledby="app-title">
        <div className="brand-mark" aria-hidden="true">NLT</div>
        <p className="eyebrow">NEUROLIFT TECHNOLOGIES</p>
        <h1 id="app-title">NLT Coding Agent</h1>
        <p className="intro">
          A human-directed, AI-assisted software engineering agent.
        </p>
        <div className="status" role="status">
          <span className="status-dot" />
          React Space frontend build is online
        </div>
        <div className="status" role="status">
          <span className="status-dot" />
          Harness endpoint: {HARNESS_ENDPOINT}
        </div>
        <div className="chat-log" aria-live="polite">
          {messages.map((message, index) => (
            <div key={index} className={`chat-message chat-${message.role}`}>
              {message.text}
            </div>
          ))}
        </div>
        <form className="chat-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Describe a task..."
            aria-label="Task prompt"
          />
          <button type="submit">Send</button>
        </form>
        <p className="supporting-copy">
          The user interface and agent runtime are being developed as separate
          components. Repository analysis, model inference, and code execution
          will connect through the configured service layer.
        </p>
      </section>
      <footer>ElevAIting Minds, Changing Lives.</footer>
    </main>
  );
}

export default App;
