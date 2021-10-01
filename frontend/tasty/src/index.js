import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import CurrentUserContextProvider from "./Contexts/currentUserContext"

ReactDOM.render(
  <React.StrictMode>
    <CurrentUserContextProvider>
      <App />
    </CurrentUserContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);