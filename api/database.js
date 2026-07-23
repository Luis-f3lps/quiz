// Localização: api/database.js

import pg from 'pg';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente (necessário em cada arquivo que as usa)
dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false // Adicione isso se estiver conectando a um DB na Vercel ou Heroku
  }
});

export default pool;