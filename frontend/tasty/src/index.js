import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ChatContextProvider from './Contexts/chatContext';
import CurrentUserContextProvider from "./Contexts/currentUserContext"

ReactDOM.render(
  <React.StrictMode>
    <CurrentUserContextProvider>
      <ChatContextProvider>
        <App />
      </ChatContextProvider>
    </CurrentUserContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);