const express = require("express");
const notificationController = require("../controllers/notification-controller");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notification
 *   description: Notification endpoints
 */

/**
 * @swagger
 * /notification/subscribe-notification:
 *   post:
 *     summary: Subscribe user to notification for a parking spot
 *     tags: [Notification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               parkingSpotId:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       201:
 *         description: User subscribed to notification successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 operation:
 *                   type: string
 *                 success:
 *                   type: boolean
 *             example:
 *               operation: "subscribe-notification"
 *               success: true
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 operation:
 *                   type: string
 *                 error:
 *                   type: string
 *                 success:
 *                   type: boolean
 *             example:
 *               operation: "subscribe-notification"
 *               success: false
 *               error: "Internal Server Error"
 */
router.post("/subscribe-notification", notificationController.subscribeToNotification);

/**
 * @swagger
 * /notification/user-notifications/{userId}:
 *   get:
 *     summary: Get user notifications by user ID
 *     tags: [Notification]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User notifications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 operation:
 *                   type: string
 *                 userNotifications:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       notificationId:
 *                         type: string
 *                       parkingSpotName:
 *                         type: string
 *                 success:
 *                   type: boolean
 *             example:
 *               operation: "get-user-notifications"
 *               userNotifications: [
 *                 { notificationId: "1", parkingSpotName: "Parking Spot 1" },
 *                 { notificationId: "2", parkingSpotName: "Parking Spot 2" }
 *               ]
 *               success: true
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 operation:
 *                   type: string
 *                 error:
 *                   type: string
 *                 success:
 *                   type: boolean
 *             example:
 *               operation: "get-user-notifications"
 *               success: false
 *               error: "Internal Server Error"
 */
router.get("/user-notifications/:userId", notificationController.getUserNotifications);

/**
 * @swagger
 * /notification/unsubscribe-notification/{notificationId}:
 *   delete:
 *     summary: Unsubscribe from notification by notification ID
 *     tags: [Notification]
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Unsubscribed from notification successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 operation:
 *                   type: string
 *                 success:
 *                   type: boolean
 *             example:
 *               operation: "unsubscribe-notification"
 *               success: true
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 operation:
 *                   type: string
 *                 error:
 *                   type: string
 *                 success:
 *                   type: boolean
 *             example:
 *               operation: "unsubscribe-notification"
 *               success: false
 *               error: "Internal Server Error"
 */
router.delete("/unsubscribe-notification/:notificationId", notificationController.unsubscribeFromNotificationByNotificationId);

/**
 * @swagger
 * /notification/unsubscribe-notification:
 *   delete:
 *     summary: Unsubscribe user from notification by user ID and parking spot ID
 *     tags: [Notification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               parkingSpotId:
 *                 type: string
 *     responses:
 *       200:
 *         description: User unsubscribed from notification successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 operation:
 *                   type: string
 *                 success:
 *                   type: boolean
 *             example:
 *               operation: "unsubscribe-notification"
 *               success: true
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 operation:
 *                   type: string
 *                 error:
 *                   type: string
 *                 success:
 *                   type: boolean
 *             example:
 *               operation: "unsubscribe-notification"
 *               success: false
 *               error: "Internal Server Error"
 */
router.delete("/unsubscribe-notification", notificationController.unsubscribeFromNotificationByUserAndParkingSpotId);

/**
 * @swagger
 * /notification/register-push-token:
 *   post:
 *     summary: Register push token for user
 *     tags: [Notification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               token:
 *                 type: string
 *     responses:
 *       201:
 *         description: Push token registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 operation:
 *                   type: string
 *                 success:
 *                   type: boolean
 *             example:
 *               operation: "register-push-token"
 *               success: true
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 operation:
 *                   type: string
 *                 error:
 *                   type: string
 *                 success:
 *                   type: boolean
 *             example:
 *               operation: "register-push-token"
 *               success: false
 *               error: "Internal Server Error"
 */
router.post("/register-push-token", notificationController.registerPushToken);

/**
 * @swagger
 * /notification/delete-push-token:
 *   delete:
 *     summary: Delete push token for user
 *     tags: [Notification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Push token deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 operation:
 *                   type: string
 *                 success:
 *                   type: boolean
 *             example:
 *               operation: "delete-push-token"
 *               success: true
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 operation:
 *                   type: string
 *                 error:
 *                   type: string
 *                 success:
 *                   type: boolean
 *             example:
 *               operation: "delete-push-token"
 *               success: false
 */
router.delete("/delete-push-token", notificationController.deletePushToken);

module.exports = router;
