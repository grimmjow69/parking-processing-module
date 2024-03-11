const NotificationService = require("../services/notification-service");
const db = require("../db-connection");

const notificationService = new NotificationService(db);

exports.registerPushToken = async (req, res) => {
  try {
    const userId = req.body.userId;
    const pushToken = req.body.token;
    const result = await notificationService.savePushToken(userId, pushToken);
    res.status(200).json({ success: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePushToken = async (req, res) => {
  try {
    const userId = req.body.userId;
    const result = await notificationService.deletePushToken(userId);
    res.status(200).json({ success: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.subscribeToNotification = async (req, res) => {
  try {
    const { parkingSpotId, userId } = req.body;
    await notificationService.addNotification(parkingSpotId, userId);

    res.status(201).json({
      success: true,
    });
  } catch (error) {
    console.error("Error subscribing to notification:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userNotifications = await notificationService.getAllUserNotifications(
      userId
    );

    res.status(200).json({ notifications: userNotifications });
  } catch (error) {
    console.error("Error getting user notifications:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.unsubscribeFromNotification = async (req, res) => {
  try {
    const notificationId = req.params.notificationId;
    await notificationService.deleteNotificationById(notificationId);

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("Error unsubscribing from notifications:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
