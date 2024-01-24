const bcrypt = require("bcrypt");

class AuthService {
  constructor(db) {
    this.db = db;
  }

  async verifyPassword(userId, password) {
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

  async logoutUser() {
    // TO DO
    return null;
  }
}

module.exports = AuthService;
