const UserService = require("../services/user-service");
const NotificationService = require("../services/notification-service");
const db = require("../db-connection");

const userService = new UserService(db);
const notificationService = new NotificationService(db);


exports.subscribeToNotification = async (req, res) => {};
exports.getUserNotifications = async (req, res) => {};
exports.unsubscribeFromNotification = async (req, res) => {};