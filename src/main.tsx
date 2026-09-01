import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure window.fetch has both getter and setter for analytics or third-party wrappers
try {
  if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
    let currentFetch = window.fetch;
    const desc = Object.getOwnPropertyDescriptor(window, 'fetch');
    if (!desc || (!desc.writable && !desc.set)) {
      Object.defineProperty(window, 'fetch', {
        get: () => currentFetch,
        set: (fn) => {
          currentFetch = fn;
        },
        configurable: true,
        enumerable: true,
      });
    }
  }
} catch {
  // Silent fallback
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
