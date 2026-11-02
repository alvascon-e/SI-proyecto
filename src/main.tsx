import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { MODO_GUION } from './store';

if (MODO_GUION) document.body.classList.add('guion');

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
