const bcrypt = require("bcryptjs");

class AuthService {
  constructor(db) {
    this.db = db;
  }

  async verifyPasswordWithUserId(userId, password) {
    const query = `
      SELECT user_id, password
      FROM public."users"
      WHERE user_id = $1
    `;
    try {
      const values = [userId];
      const { rows } = await this.db.query(query, values);

      if (rows.length > 0) {
        const hashedDbPassword = rows[0].password;
        return await bcrypt.compare(password, hashedDbPassword);
      } else {
        throw new Error(`User with ID ${userId} not found`);
      }
    } catch (error) {
      throw new Error(
        `Unable to retrieve user with ID ${userId}: ${error.message}`
      );
    }
  }

  async verifyPasswordWithEmail(email, password) {
    const query = `
      SELECT email, password
      FROM public."users"
      WHERE email = $1
    `;

    try {
      const values = [email];
      const { rows } = await this.db.query(query, values);

      if (rows.length > 0) {
        const hashedDbPassword = rows[0].password;
        return await bcrypt.compare(password, hashedDbPassword);
      } else {
        throw new Error(`User with email ${email} not found`);
      }
    } catch (error) {
      throw new Error(
        `Unable to retrieve user with email ${email}: ${error.message}`
      );
    }
  }
}

module.exports = AuthService;
