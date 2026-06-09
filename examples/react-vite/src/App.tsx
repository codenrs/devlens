import { useState } from 'react';
import './App.css';

import { DevLens, DevLensErrorBoundary, useDevLensRender } from '@codenrs/devlens-react';

import '@codenrs/devlens-react/styles.css';

function BrokenComponent({ shouldBreak }: { shouldBreak: boolean }) {
  useDevLensRender('BrokenComponent');

  if (shouldBreak) {
    throw new Error('DevLens test error from BrokenComponent');
  }

  return <p>Broken component is safe now.</p>;
}

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

  const [shouldBreak, setShouldBreak] = useState(false);

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
        <button
          onClick={() => {
            throw new Error('Runtime crash test');
          }}
        >
          Runtime Error Test
        </button>
        <button
          onClick={() => {
            Promise.reject(new Error('Unhandled promise rejection test'));
          }}
        >
          Promise Rejection Test
        </button>

        <div style={{ marginTop: 24 }}>
          <h2>Error Boundary Test</h2>

          <button onClick={() => setShouldBreak(true)}>Trigger React Error</button>

          <DevLensErrorBoundary fallback={<p>Component crashed safely.</p>}>
            <BrokenComponent shouldBreak={shouldBreak} />
          </DevLensErrorBoundary>
        </div>
      </div>

      <DevLens />
    </>
  );
}

export default App;
