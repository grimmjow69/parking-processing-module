const { pool } = require("../db-connection");

class DataRetentionService {
  constructor() {
    this.db = pool;
  }

  async cleanUpParkingHistory() {
    const query = `
      DELETE FROM public."parking_spot_histories"
      WHERE updated_at < NOW() - INTERVAL '7 days'; 
    `;

    try {
      const result = await this.db.query(query);
      return result.rowCount > 0;
    } catch (error) {
      throw new Error(
        `Unable to clean up history of parking spots older than 7 days: ${error.message}`
      );
    }
  }
}

module.exports = DataRetentionService;
