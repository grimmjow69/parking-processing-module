const Notification = require("../models/notification");
const UserService = require("../services/user-service");

const db = require("../db-connection");
const userService = new UserService(db);

const { Expo } = require("expo-server-sdk");
let expo = new Expo();

class NotificationService {
  constructor(db) {
    this.db = db;
  }

  async savePushToken(userId, pushToken) {
    const query = `
      UPDATE public."users" SET push_token = $1
      WHERE user_id = $2;
    `;

    const values = [pushToken, userId];

    try {
      await this.db.query(query, values);
      console.log(`Deleteing push token of user with id: ${userId}`);
      return true;
    } catch (error) {
      throw new Error(`Unable to save push token: ${error.message}`);
    }
  }

  async deletePushToken(userId) {
    const query = `
      UPDATE public."users" SET push_token = null
      WHERE user_id = $1;
    `;

    const values = [userId];

    try {
      await this.db.query(query, values);
      console.log(`Adding push token for user with id: ${userId}`);
      return true;
    } catch (error) {
      throw new Error(`Unable to delete push token: ${error.message}`);
    }
  }

  async sendPushNotification() {
    let messages = [];

    const users = await userService.getAllUsers();

    for (let user of users) {
      if (!Expo.isExpoPushToken(user.pushToken)) {
        continue;
      }

      messages.push({
        to: user.pushToken,
        sound: "default",
        body: "body",
        data: { withSome: "data" },
      });
    }

    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error(error);
      }
    }
    return tickets;
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
