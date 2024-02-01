const Rating = require("../models/rating");

class RatingService {
  constructor(db) {
    this.db = db;
  }

  async addRating(userId, parkingSpotId, rating, comment) {
    const query = `
      INSERT INTO public."ratings" (user_id, parking_spot_id, rating, comment)
      VALUES ($1, $2, $3, $4)
    `;
    const values = [parkingSpotId, userId];

    try {
      const { rows } = await this.db.query(query, values);
      if (rows.length > 0) {
        return true;
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(`Unable to add new notification: ${error.message}`);
    }
  }

  async deleteRatingById(ratingId) {
    const query = `
      DELETE FROM public."ratings"
      WHERE rating_id = $1;
    `;
    const values = [ratingId];

    try {
      await this.db.query(query, values);
      return true;
    } catch (error) {
      throw new Error(`Unable to add new notification: ${error.message}`);
    }
  }

  async getAllUserRatingsByUserId(userId) {
    const query = `
      SELECT rating_id, user_id, parking_spot_id, rating, comment, created_at
      FROM public."ratings"
      WHERE user_id = $1;
    `;
    const values = [userId];

    try {
      const { rows } = await this.db.query(query, values);
      return rows.map(
        (row) =>
          new Rating({
            ratingId: row.rating_id,
            userId: row.userId,
            parkingSpotId: row.parking_spot_id,
            rating: row.rating,
            comment: row.comment,
            createdAt: row.created_at
          })
      );
    } catch (error) {
      throw new Error(
        `Unable to retrieve user parking spot ratings: ${error.message}`
      );
    }
  }

  async getAllParkingSpotRatingsByParkingSpotId(parkingSpotId) {
    const query = `
      SELECT rating_id, user_id, parking_spot_id, rating, comment, created_at
      FROM public."ratings"
      WHERE user_id = $1;
    `;
    const values = [parkingSpotId];

    try {
      const { rows } = await this.db.query(query, values);
      return rows.map(
        (row) =>
          new Rating({
            ratingId: row.rating_id,
            userId: row.userId,
            parkingSpotId: row.parking_spot_id,
            rating: row.rating,
            comment: row.comment,
            createdAt: row.created_at
          })
      );
    } catch (error) {
      throw new Error(
        `Unable to retrieve all ratings for parking spot: ${error.message}`
      );
    }
  }
}

module.exports = RatingService;
