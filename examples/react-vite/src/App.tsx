import './App.css';
import { DevLens } from '@codenrs/devlens-react';

function App() {
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
      </div>

      <DevLens />
    </>
  );
}

export default App;
