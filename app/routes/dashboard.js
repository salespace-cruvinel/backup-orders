import { Router } from "express";
import db from "../database/index.js";
import { fetchAllSalesData } from '../services/sales-data.service.js';

const router = Router();

router.get("/status-summary", async (req, res) => {
  console.log("Rota /api/dashboard/status-summary chamada");
  const client = await db.connect();
  console.log("Conexão com o banco de dados estabelecida");
  try {
    const debugResult = await client.query({
      query: 'SELECT COUNT(*) AS total_orders FROM "order"',
      values: {}
    });
    console.log(`[DEPURAÇÃO] A aplicação encontrou ${debugResult[0].total_orders} linhas na tabela "order".`);

    const allSaleStatuses = await client.query({
      query: 'SELECT id, name FROM sale_status ORDER BY id',
      values: {}
    });
    const allOrderStatuses = await client.query({
      query: 'SELECT id, name FROM order_status ORDER BY id',
      values: {}
    });

    const allSketchSales = await fetchAllSalesData();
    const sketchIdempotencyKeys = allSketchSales.map((s) => s.idempotencyKey);
    
    let persistedKeys = new Set();
    if (sketchIdempotencyKeys.length > 0) {
      const persistedResult = await client.query({
        query: `SELECT idempotency_key FROM sale WHERE created_by_user_id != 1 AND idempotency_key = ANY($keys::varchar[])`,
        values: { keys: sketchIdempotencyKeys }
      });
      persistedKeys = new Set(persistedResult.map((r) => r.idempotency_key));
    }

    const sketchSummary = {
      statusId: 0,
      statusName: "Rascunho",
      saleCount: 0,
      totalValue: 0,
    };
    allSketchSales.forEach((sale) => {
      if (!persistedKeys.has(sale.idempotencyKey)) {
        sketchSummary.saleCount++;
        if (sale.record && Array.isArray(sale.record.orders)) {
          sale.record.orders.forEach((order) => {
            if (Array.isArray(order.skus)) {
              const orderValue = order.skus.reduce(
                (total, sku) => {
                  const quantity = typeof sku.quantity === 'number' ? sku.quantity : 0;
                  const unitPrice = typeof sku.evaluatedUnitPrice === 'number' ? sku.evaluatedUnitPrice : 0;
                  return total + (quantity * unitPrice);
                },
                0
              );
              sketchSummary.totalValue += orderValue;
            }
          });
        }
      }
    });

    const salesStatusQuery = `
      SELECT
        ss.id AS "statusId",
        ss.name AS "statusName",
        COUNT(s.id)::int AS "saleCount",
        COALESCE(SUM(s.products_total + s.shipping_total + s.taxes_total + s.others_total - s.discounts_total), 0) AS "totalValue"
      FROM sale_status ss
      LEFT JOIN sale s ON ss.id = s.sale_status_id 
        AND s.deleted_at IS NULL
        AND s.created_by_user_id != 1
      GROUP BY ss.id, ss.name
      ORDER BY ss.id;
    `;
    const persistedSalesSummary = await client.query({
      query: salesStatusQuery,
      values: {}
    });
    
    const finalSalesSummary = [sketchSummary, ...persistedSalesSummary];

    const ordersStatusQuery = `
      SELECT
        os_status.id as "statusId",
        os_status.name as "statusName",
        COUNT(DISTINCT o.id)::int as "orderCount",
        COALESCE(SUM(os.quantity * os.evaluated_unit_price), 0) as "totalValue"
      FROM order_status os_status
      LEFT JOIN "order" o ON os_status.id = o.order_status_id 
        AND o.deleted_at IS NULL
        AND o.created_by_user_id != 1
      LEFT JOIN order_sku os ON o.id = os.order_id
      GROUP BY os_status.id, os_status.name
      ORDER BY os_status.id;
    `;
    const finalOrdersSummary = await client.query({
      query: ordersStatusQuery,
      values: {}
    });

    res.json({
      salesSummary: finalSalesSummary,
      ordersSummary: finalOrdersSummary,
    });

  } catch (error) {
    console.error("Erro ao gerar resumo do dashboard:", error);
    res.status(500).json({ message: "Erro no servidor ao gerar resumo." });
  } finally {
    console.log("A libertar cliente da base de dados.");
    client.release();
  }
});

export default router;
