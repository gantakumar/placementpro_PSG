import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
// Note: intentionally NOT wrapped in <React.StrictMode>. The original
// PlacementPro app is a classic (non-module) script that declares top-level
// const/let bindings; StrictMode's dev-only double-invoke of effects could
// cause it to be injected and executed twice, which would throw
// "Identifier has already been declared" errors.
root.render(<App />);
