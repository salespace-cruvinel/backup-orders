import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const s3Client = new S3Client({});
const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'dev-salespace-sales-backups';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CACHE_DIR = path.join(__dirname, '..', 's3-cache');

const ensureCacheDirExists = async () => {
  try { await fs.mkdir(CACHE_DIR, { recursive: true }); } catch (e) { console.error("Erro ao criar cache dir", e); }
};

const streamToString = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });

export async function fetchAllSalesData() {
  await ensureCacheDirExists();
  
  const scanCommand = new ScanCommand({ TableName: "sales-backups" });
  const dynamoResponse = await dynamoClient.send(scanCommand);
  
  const initialSales = dynamoResponse.Items?.filter(sale => sale.userId !== '1' && sale.userId !== 1) || [];
  console.log(`Dados do Dynamo filtrados. Processando ${initialSales.length} vendas.`);

  const processedSalesPromises = initialSales.map(async (sale) => {
    const s3Key = `rosset/${sale.compositeKey}.json`;
    const cachePath = path.join(CACHE_DIR, `${sale.compositeKey}.json`);
    let enrichedRecord = null;

    try {
      const cachedData = await fs.readFile(cachePath, 'utf8');
      enrichedRecord = JSON.parse(cachedData);
    } catch (cacheError) {
      try {
        const getObjectCmd = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: s3Key });
        const s3Response = await s3Client.send(getObjectCmd);
        const s3DataString = await streamToString(s3Response.Body);
        await fs.writeFile(cachePath, s3DataString);
        enrichedRecord = JSON.parse(s3DataString);
      } catch (s3Error) {
        if (sale.record) {
          enrichedRecord = sale.record;
        }
      }
    }
    return { ...sale, record: enrichedRecord };
  });

  return Promise.all(processedSalesPromises);
}
