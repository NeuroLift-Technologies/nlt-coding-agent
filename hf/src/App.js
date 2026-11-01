import './App.css';

const HARNESS_ENDPOINT =
  process.env.REACT_APP_HARNESS_ENDPOINT || 'TBD';

function App() {
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
