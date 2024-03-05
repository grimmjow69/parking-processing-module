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
    const values = [userId];
    const { rows } = await this.db.query(query, values);
    try {
      if (rows.length > 0) {
        const hashedDbPassword = rows[0].password;
        return await bcrypt.compare(password, hashedDbPassword);
      } else {
        throw new Error(`User not found`);
      }
    } catch (error) {
      throw new Error(`Unable to retrieve user by user id: ${error.message}`);
    }
  }

  async verifyPasswordWithEmail(email, password) {
    const query = `
      SELECT email, password
      FROM public."users"
      WHERE email = $1
    `;
    const values = [email];
    const { rows } = await this.db.query(query, values);
    try {
      if (rows.length > 0) {
        const hashedDbPassword = rows[0].password;
        return await bcrypt.compare(password, hashedDbPassword);
      } else {
        throw new Error(`User not found`);
      }
    } catch (error) {
      throw new Error(`Unable to retrieve user by user id: ${error.message}`);
    }
  }

  async logoutUser() {
    // TO DO
    return null;
  }
}

module.exports = AuthService;
