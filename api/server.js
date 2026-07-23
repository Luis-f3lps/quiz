const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/questoes', (req, res) => {
  res.sendFile(path.join(__dirname, 'questions.json'));
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(3000, () => console.log('Servidor rodando localmente na porta 3000'));
}

// Para a Vercel executar como Serverless Function
module.exports = app;