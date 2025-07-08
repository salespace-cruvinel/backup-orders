export class DbClient {
  pgClient;
  constructor(pgClient) {
    this.pgClient = pgClient;
  }

  _formatQuery(query, values = {}) {
    const entries = Object.entries(values);
    let formattedQuery = query;
    const pgValues = [];

    for (let i = 0; i < entries.length; i++) {
      const [key, value] = entries[i];
      if (formattedQuery.includes("$" + key)) {
        formattedQuery = formattedQuery.replaceAll(
          "$" + key,
          `$${pgValues.length + 1}`
        );
        pgValues.push(value);
      }
    }
    return { query: formattedQuery, values: pgValues };
  }

  async query({query, values}) {
    const { query:pgQuery, values: pgValues } = this._formatQuery(query, values);

    console.log(`Executando Query: ${pgQuery}`);
    console.log(`Valores: ${JSON.stringify(pgValues)}`);

    const response = await this.pgClient.query({
      text: pgQuery,
      values: pgValues,
    });

    return response.rows;
  }

  async startTransaction() {
    await this.pgClient.query("BEGIN");
  }

  async commitTransaction() {
    await this.pgClient.query("COMMIT");
  }

  async rollbackTransaction() {
    await this.pgClient.query("ROLLBACK");
  }

  release() {
    this.pgClient.release();
  }
}
