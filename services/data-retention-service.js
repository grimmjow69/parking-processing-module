class DataRetentionService {
  constructor(db) {
    this.db = db;
  }

  async cleanUpParkingHistory() {
    const query = `
      DELETE FROM public."parking_spot_histories"
      WHERE updated_at < NOW() - INTERVAL '3 days'; 
    `;

    try {
      const result = await this.db.query(query);
      return result.rowCount > 0;
    } catch (error) {
      throw new Error(
        `Unable to clean up history of parking spots older than 3 days: ${error.message}`
      );
    }
  }
}

module.exports = DataRetentionService;
