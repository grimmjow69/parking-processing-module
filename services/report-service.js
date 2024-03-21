const db = require("../db-connection");

class ReportService {
  constructor(db) {
    this.db = db;
  }

  async saveReport(userId, reportMessage, category) {
    const query = `
        INSERT INTO public."reports" (
        user_id, 
        message,
        category
        ) VALUES ($1, $2, $3)
    `;

    const values = [userId, reportMessage, category];

    try {
      await this.db.query(query, values);
      return true;
    } catch (error) {
      throw new Error(
        `Unable to find closest free parking spot: ${error.message}`
      );
    }
  }
}

module.exports = ReportService;
