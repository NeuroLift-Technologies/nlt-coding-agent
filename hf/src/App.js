import React, { useState, useRef, useCallback } from 'react';
import './App.css';

const HARNESS_ENDPOINT = process.env.REACT_APP_HARNESS_ENDPOINT || '';

const STATUS = {
  UNCONFIGURED: 'unconfigured',
  IDLE: 'idle',
  LOADING: 'loading',
  ERROR: 'error',
};

function App() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState(
    HARNESS_ENDPOINT ? STATUS.IDLE : STATUS.UNCONFIGURED
  );
  const [error, setError] = useState('');
  const abortRef = useRef(null);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const trimmed = prompt.trim();
      if (!trimmed) {
        setError('Prompt cannot be empty.');
        return;
      }
      if (!HARNESS_ENDPOINT) {
        setError('Harness endpoint is not configured.');
        return;
      }
      if (status === STATUS.LOADING) return;

      setError('');
      setStatus(STATUS.LOADING);
      setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
      setPrompt('');

      const controller = new AbortController();
      abortRef.current = controller;

      fetch(HARNESS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: trimmed }),
        signal: controller.signal,
      })
        .then(async (response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          const data = await response.json();
          if (!data || typeof data.reply !== 'string') {
            throw new Error('Invalid harness response.');
          }
          setMessages((prev) => [...prev, { role: 'agent', text: data.reply }]);
          setStatus(STATUS.IDLE);
        })
        .catch((err) => {
          if (err.name === 'AbortError') return;
          setMessages((prev) => [
            ...prev,
            { role: 'agent', text: 'Request failed.' },
          ]);
          setError(err.message || 'Request failed.');
          setStatus(STATUS.ERROR);
        })
        .finally(() => {
          abortRef.current = null;
        });
    },
    [prompt, status]
  );

  const statusLabel =
    status === STATUS.UNCONFIGURED
      ? 'Not configured'
      : status === STATUS.LOADING
      ? 'Request in progress'
      : status === STATUS.ERROR
      ? 'Request failed'
      : 'Configured';

  return (
    <main className="app-shell">
      <section className="agent-panel" aria-labelledby="app-title">
        <div className="brand-mark" aria-hidden="true">NLT</div>
        <p className="eyebrow">NEUROLIFT TECHNOLOGIES</p>
        <h1 id="app-title">NLT Coding Agent</h1>
        <p className="intro">
          A human-directed, AI-assisted software engineering agent.
        </p>
        <div
          className={`status status-${status}`}
          role="status"
          aria-live="polite"
        >
          <span className="status-dot" />
          {statusLabel}: {HARNESS_ENDPOINT || 'TBD'}
        </div>
        {error ? <p className="error-text">{error}</p> : null}
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
            disabled={status === STATUS.LOADING}
          />
          <button
            type="submit"
            disabled={status === STATUS.LOADING}
          >
            {status === STATUS.LOADING ? 'Sending...' : 'Send'}
          </button>
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
