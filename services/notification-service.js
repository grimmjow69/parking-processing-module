const Notification = require("../models/notification");

class NotificationService {
  constructor(db) {
    this.db = db;
  }

  async addNotification(parkingSpotId, userId) {
    const query = `
      INSERT INTO public."notifications" (parking_spot_id, user_id)
      VALUES ($1, $2)
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

  async deleteNotificationById(notificationId) {
    const query = `
      DELETE FROM public."notifications"
      WHERE notification_id = $1;
    `;
    const values = [notificationId];

    try {
      await this.db.query(query, values);
      return true;
    } catch (error) {
      throw new Error(`Unable to delete notification: ${error.message}`);
    }
  }

  async deleteNotificationsByUserId(userId) {
    const query = `
      DELETE FROM public."notifications"
      WHERE user_id = $1;
    `;
    const values = [userId];

    try {
      await this.db.query(query, values);
      return true;
    } catch (error) {
      throw new Error(`Unable to delete user notifications: ${error.message}`);
    }
  }

  async getAllUserNotifications(userId) {
    const query = `
      SELECT notification_id, parking_spot_id, user_id
      FROM public."notifications"
      WHERE user_id = $1;
    `;
    const values = [userId];

    try {
      const { rows } = await this.db.query(query, values);
      return rows.map(
        (row) =>
          new Notification({
            notificationId: row.notification_id,
            parkingSpotId: row.parking_spot_id,
            userId: row.user_id,
            createdAt: row.created_at,
          })
      );
    } catch (error) {
      throw new Error(
        `Unable to retrieve user notifications: ${error.message}`
      );
    }
  }
}

module.exports = NotificationService;
