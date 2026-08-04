import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as React from 'react';
import { createRoot } from 'react-dom/client';

import { fixActive } from 'utils/fixActive';
import { initEruda } from 'utils/init';

import './styles/global.scss';

import App from './App';

const startApp = () => {
  fixActive();

  initEruda(import.meta.env.DEV);

  createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
