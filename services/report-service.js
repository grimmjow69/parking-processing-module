const { pool } = require("../db-connection");

class ReportService {
  constructor() {
    this.db = pool;
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
        `Unable to save report for user with ID ${userId} in category ${category}: ${error.message}`
      );
    }
  }
}

module.exports = ReportService;
