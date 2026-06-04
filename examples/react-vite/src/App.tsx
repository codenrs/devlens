import './App.css';
import { DevLens } from '@codenrs/devlens-react';

function App() {
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

        <p>Testing DevLens inside React Vite example application.</p>
      </div>

      <DevLens />
    </>
  );
}

export default App;
