const NotificationService = require("../services/notification-service");
const db = require("../db-connection");

const notificationService = new NotificationService(db);

exports.registerPushToken = async (req, res) => {
  try {
    const userId = req.body.userId;
    const pushToken = req.body.token;
    const result = await notificationService.savePushToken(userId, pushToken);
    console.log(`Sucefuly register push token of user: ${userId}`);
    res.status(200);
  } catch (error) {
    console.error(`Error while registering push token: ${error.message}`);
    res.status(500);
  }
};

exports.deletePushToken = async (req, res) => {
  try {
    const userId = req.body.userId;
    const result = await notificationService.deletePushToken(userId);
    console.log(`Sucefuly deleted push token of user: ${userId}`);
    res.status(200);
  } catch (error) {
    console.error(`Error while deleting push token: ${error.message}`);
    res.status(500);
  }
};

exports.subscribeToNotification = async (req, res) => {
  try {
    const { parkingSpotId, userId } = req.body;
    await notificationService.addNotification(parkingSpotId, userId);

    console.log(
      `User: ${userId} succesfuly subscribed for notification of parking spot with id: ${parkingSpotId}`
    );
    res.status(201);
  } catch (error) {
    console.error(`Error subscribing to notification: ${error.message}`);
    res.status(500);
  }
};

exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userNotifications = await notificationService.getAllUserNotifications(
      userId
    );

    console.log(`Succesfuly got user notifications, user: ${userId}`);
    res.status(200);
  } catch (error) {
    console.error(`Error getting user notifications: ${error.message}`);
    res.status(500);
  }
};

exports.unsubscribeFromNotificationByNotificationId = async (req, res) => {
  try {
    const notificationId = req.params.notificationId;
    await notificationService.deleteNotificationById(notificationId);

    console.log(
      `Succesfuly unsubscribed from notification id: ${notificationId}`
    );
    res.status(200);
  } catch (error) {
    console.error(`Error unsubscribing from notifications: ${error.message}`);
    res.status(500);
  }
};

exports.unsubscribeFromNotificationByUserAndParkingSpotId = async (
  req,
  res
) => {
  try {
    const { userId, parkingSpotId } = req.body;
    await notificationService.deleteNotificationByUserAndParkingSpot(
      userId,
      parkingSpotId
    );
    console.log(
      `User: ${userId} succesfuly unsubscribed from notification of parking spot with id: ${parkingSpotId}`
    );
    res.status(200);
  } catch (error) {
    console.error(`Error unsubscribing from notifications: ${error.message}`);
    res.status(500);
  }
};
