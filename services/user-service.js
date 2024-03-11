const bcrypt = require("bcryptjs");

class UserService {
  constructor(db) {
    this.db = db;
  }

  async addUser(userDetail) {
    const query = `
        INSERT INTO public."users" (
          email, 
          password
        ) VALUES ($1, $2)
        RETURNING user_id;
    `;

    const saltRounds = 7;
    const hashedPassword = await bcrypt.hash(userDetail.password, saltRounds);

    const values = [userDetail.email, hashedPassword];

    try {
      const { rows } = await this.db.query(query, values);
      return rows[0].user_id;
    } catch (error) {
      throw new Error(`Unable to add user: ${error.message}`);
    }
  }

  async userCredentialsTakenCheck(email) {
    const query = `
      SELECT user_id FROM public."users"
      WHERE email = $1;
    `;
    const values = [email];

    try {
      const { rows } = await this.db.query(query, values);
      return rows.length > 0;
    } catch (error) {
      throw new Error(`Unexpected error: ${error.message}`);
    }
  }

  async deleteUser(userId) {
    // TO DO delete user notifications
    const query = `
      DELETE FROM public."users"
      WHERE user_id = $1;
    `;
    const values = [userId];

    try {
      const result = await this.db.query(query, values);
      return result.rowCount > 0;
    } catch (error) {
      throw new Error(`Unable to delete user: ${error.message}`);
    }
  }

  async updateFavouriteSpot(userId, favouriteSpotId) {
    const query = `
      UPDATE public.users
      SET favourite_spot_id = $1, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $2
    `;
    const values = [favouriteSpotId, userId];

    try {
      await this.db.query(query, values);
      return true;
    } catch (error) {
      throw new Error(`Unable to update user favourite spot: ${error.message}`);
    }
  }

  async getAllUsersWithSameFavouriteSpot(favouriteSpotId) {
    const query = `
      SELECT user_id, email,  created_at, updated_at, favourite_spot_id
      FROM public."users"
      WHERE favourite_spot_id = $1
    `;

    const values = [favouriteSpotId];
    try {
      const { rows } = await this.db.query(query, values);
      return rows.map((row) => ({
        userId: row.user_id,
        email: row.email,
        password: null,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        favouriteSpotId: row.favourite_spot_id,
      }));
    } catch (error) {
      throw new Error(
        `Unable to retrieve all users with same favourite spot: ${error.message}`
      );
    }
  }

  async getAllUsers() {
    const query = `
      SELECT user_id, email,  created_at, updated_at, favourite_spot_id, push_token
      FROM public."users"
    `;

    try {
      const { rows } = await this.db.query(query);
      return rows.map((row) => ({
        userId: row.user_id,
        email: row.email,
        password: null,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        favouriteSpotId: row.favourite_spot_id,
        pushToken: row.push_token,
      }));
    } catch (error) {
      throw new Error(`Unable to retrieve all users: ${error.message}`);
    }
  }

  async updateUser(updateData) {
    const setClauses = [];
    const values = [];

    if (updateData.password) {
      // TODO pswd need to be rehashed
      setClauses.push(`password = $${setClauses.length + 1}`);
      values.push(updateData.password);
    }
    if (updateData.email) {
      setClauses.push(`email = $${setClauses.length + 1}`);
      values.push(updateData.email);
    }
    if (setClauses.length === 0) {
      throw new Error("No valid fields provided for update");
    }

    values.push(updateData.userId);

    const query = `
      UPDATE public."users"
      SET ${setClauses.join(", ")}
      WHERE user_id = $${values.length};
    `;

    try {
      await this.db.query(query, values);
      return true;
    } catch (error) {
      throw new Error(`Unable to update user: ${error.message}`);
    }
  }

  async getUserByUserId(userId) {
    const query = `
      SELECT user_id, email,  created_at, updated_at, favourite_spot_id
      FROM public."users"
      WHERE user_id = $1
    `;
    const values = [userId];
    const { rows } = await this.db.query(query, values);
    try {
      if (rows.length > 0) {
        const row = rows[0];
        return new User({
          userId: row.user_id,
          email: row.email,
          password: null,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          favouriteSpotId: row.favourite_spot_id,
        });
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(`Unable to retrieve user by user id: ${error.message}`);
    }
  }

  async getUserByEmail(userEmail) {
    const query = `
      SELECT user_id, email,  created_at, updated_at, favourite_spot_id
      FROM public."users"
      WHERE email = $1
    `;
    const values = [userEmail];

    const { rows } = await this.db.query(query, values);
    try {
      if (rows.length > 0) {
        const row = rows[0];
        return new User({
          userId: row.user_id,
          email: row.email,
          password: null,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          favouriteSpotId: row.favourite_spot_id,
        });
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(
        `Unable to retrieve user by users email: ${error.message}`
      );
    }
  }
}

module.exports = UserService;
