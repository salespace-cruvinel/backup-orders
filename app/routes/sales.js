import { Router } from 'express';
import { fetchAllSalesData } from '../services/sales-data.service.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const finalSalesData = await fetchAllSalesData();

    res.json({
      count: finalSalesData.length,
      data: finalSalesData,
    });
  } catch (error) {
    console.error("Erro na rota /api/sales:", error);
    res.status(500).json({ message: 'Erro ao buscar dados de vendas.' });
  }
});

export default router;
