import React from 'react';
import ReactDOM from 'react-dom/client';
import './style.css'; // Estilos globais
import Quiz from './public/js/quiz'; // Importando nosso componente principal do quiz

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Quiz />
  </React.StrictMode>
);