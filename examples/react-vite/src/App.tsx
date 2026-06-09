import { useState } from 'react';
import './App.css';

import { DevLens, useDevLensRender } from '@codenrs/devlens-react';

import '@codenrs/devlens-ui/styles/devlens.css';

function DemoCounterCard() {
  useDevLensRender('DemoCounterCard');

  const [count, setCount] = useState(0);

  return (
    <div style={{ marginTop: 24 }}>
      <h2>Render Tracking Test</h2>

      <p>Count: {count}</p>

      <button onClick={() => setCount((value) => value + 1)}>Trigger Re-render</button>
    </div>
  );
}

function App() {
  useDevLensRender('App');

  const callSuccessApi = async () => {
    await fetch('https://jsonplaceholder.typicode.com/posts/1');
  };

  const callFailedApi = async () => {
    try {
      await fetch('https://jsonplaceholder.typicode.com/invalid-url-404');
    } catch {
      // ignore for demo
    }
  };

  return (
    <>
      <div
        style={{
          padding: 40,
          color: 'white',
          background: '#0f172a',
          minHeight: '100vh',
        }}
      >
        <h1>DevLens Playground</h1>

        <p>Testing DevLens API monitoring inside React Vite example application.</p>

        <button onClick={callSuccessApi}>Call Success API</button>

        <button onClick={callFailedApi} style={{ marginLeft: 12 }}>
          Call Failed API
        </button>

        <DemoCounterCard />
      </div>

      <DevLens />
    </>
  );
}

export default App;
