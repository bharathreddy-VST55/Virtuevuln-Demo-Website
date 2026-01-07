import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './router/AppRoutes';
import { initDependencies } from './main';
import './index.css';

function AppWrapper() {
  useEffect(() => {
    // Initialize dependencies only once when component mounts
    initDependencies();
  }, []); // Empty dependency array - run only once

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(document.getElementById('root')!);
root.render(
  // <React.StrictMode>
  <AppWrapper />
  // </React.StrictMode>
);
