import React from 'react';
import { render } from 'react-dom';
import App from './App';
import '@/i18n';

declare global {
  interface Window {
    electron: any
  }
};

render( <App />, document.getElementById('root'));
