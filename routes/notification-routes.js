const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification-controller");

router.post("/subscribe", notificationController.subscribeToNotification);

router.get(
  "/user-notifications/:userId",
  notificationController.getUserNotifications
);

router.delete(
  "/unsubscribe/:notificationId",
  notificationController.unsubscribeFromNotificationByNotificationId
);

router.post(
  "/unsubscribe",
  notificationController.unsubscribeFromNotificationByUserAndParkingSpotId
);

router.post("/register-push-token", notificationController.registerPushToken);

router.post("/delete-push-token", notificationController.deletePushToken);

module.exports = router;
