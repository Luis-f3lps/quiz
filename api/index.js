// Localização: api/index.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './database.js'; // ✅ Importa a pool de dentro da pasta api

// Carrega as variáveis de ambiente
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// --- Teste de Conexão com o Banco de Dados Real ---
app.get('/api/test-db', async (req, res) => {
  try {
    const time = await pool.query('SELECT NOW()');
    console.log('Conexão com o banco de dados bem-sucedida!');
    res.json({
      message: 'Conexão com o banco de dados bem-sucedida!',
      dbTime: time.rows[0].now,
    });
  } catch (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    res.status(500).json({ error: 'Não foi possível conectar ao banco de dados.' });
  }
});

// --- Rotas da API (usando o banco de dados real) ---

/**
 * Rota para buscar todas as perguntas do banco de dados.
 */
app.get('/api/perguntas', async (req, res) => {
  try {
    // Supondo que você tenha uma tabela chamada "perguntas"
    const resultado = await pool.query('SELECT id, pergunta, alternativas FROM perguntas ORDER BY RANDOM() LIMIT 1');
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Nenhuma pergunta encontrada.' });
    }
    res.json(resultado.rows[0]);
  } catch (err) {
    console.error('Erro ao buscar pergunta:', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});


/**
 * Rota para verificar se uma resposta está correta.
 */
app.post('/api/verificar', async (req, res) => {
  const { perguntaId, resposta } = req.body;

  if (!perguntaId || !resposta) {
    return res.status(400).json({ error: 'ID da pergunta e resposta são obrigatórios.' });
  }

  try {
    // Supondo que a coluna com a resposta correta se chama "resposta_correta"
    const resultado = await pool.query('SELECT resposta_correta FROM perguntas WHERE id = $1', [perguntaId]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Pergunta não encontrada.' });
    }

    const respostaCorreta = resultado.rows[0].resposta_correta;
    const estaCorreto = (resposta === respostaCorreta);

    res.json({ correto: estaCorreto });

  } catch (err) {
    console.error('Erro ao verificar resposta:', err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// ✅ Exporta o app usando a sintaxe ESM para a Vercel
export default app;