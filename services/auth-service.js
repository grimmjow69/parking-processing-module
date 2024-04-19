const bcrypt = require("bcryptjs");
const { pool } = require("../db-connection");

class AuthService {
  constructor() {
    this.db = pool;
  }

  async verifyPassword(query, values, password) {
    try {
      const { rows } = await this.db.query(query, values);

      if (rows.length > 0) {
        const hashedDbPassword = rows[0].password;
        return await bcrypt.compare(password, hashedDbPassword);
      } else {
        throw new Error(`User not found`);
      }
    } catch (error) {
      console.error(`Unable to retrieve user: ${error.message}`);
      throw new Error("An error occurred while verifying the password");
    }
  }

  async verifyPasswordWithUserId(userId, password) {
    const query = `
      SELECT user_id, password
      FROM public."users"
      WHERE user_id = $1
    `;
    const values = [userId];
    return this.verifyPassword(query, values, password);
  }

  async verifyPasswordWithEmail(email, password) {
    const query = `
      SELECT email, password
      FROM public."users"
      WHERE email = $1
    `;
    const values = [email];
    return this.verifyPassword(query, values, password);
  }
}

module.exports = AuthService;
