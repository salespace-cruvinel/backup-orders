import 'dotenv/config';
import pg from 'pg';
import { DbClient } from './db-client.js';

const { Pool, types } = pg;

types.setTypeParser(types.builtins.INT8, (value) => parseInt(value, 10));
types.setTypeParser(types.builtins.FLOAT8, (value) => parseFloat(value));
types.setTypeParser(types.builtins.NUMERIC, (value) => parseFloat(value));

console.log("Conectando ao banco de dados...");

if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_DATABASE) {
  console.error("ERRO: As variáveis de ambiente DB_HOST, DB_USER, DB_PASSWORD e DB_DATABASE devem ser definidas no ficheiro .env.");
  process.exit(1);
}

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

console.log("Pool de conexões configurado.");

pool.on('connect', () => {
  console.log("Cliente conectado ao pool do PostgreSQL!");
});

pool.on('error', (err) => {
  console.error('Erro inesperado no cliente do banco de dados', err);
  process.exit(-1);
});

export default {
  async connect() {
    console.log("A obter cliente do pool...");
    const pgClient = await pool.connect();
    return new DbClient(pgClient);
  },
};
