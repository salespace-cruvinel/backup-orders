import express from "express";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

console.log("Configurando o ambiente...");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '.env');
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error("ERRO CRÍTICO: Não foi possível carregar o arquivo .env. O servidor não pode iniciar.");
  console.error(result.error);
  process.exit(1);
}
console.log("Ambiente configurado com sucesso.");

async function startServer() {
  console.log("Carregando rotas...");
  const { default: salesRouter } = await import('./routes/sales.js');
  const { default: dashboardRouter } = await import('./routes/dashboard.js');
  console.log("Rotas carregadas com sucesso.");

  const app = express();
  const port = process.env.PORT || 3001;

  app.use(cors({ origin: "http://localhost:5173" }));

  app.use('/api/sales', salesRouter);
  app.use('/api/dashboard', dashboardRouter);

  app.listen(port, () => {
    console.log(`🚀 Servidor backend a correr em http://localhost:${port}`);
  });
}

startServer();
