const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification-controller");

router.post("/subscribe", notificationController.subscribeToNotification);

router.get("/user-notifications/:userId", notificationController.getUserNotifications);

router.delete("/unsubscribe/:id", notificationController.unsubscribeFromNotification);

module.exports = router;
