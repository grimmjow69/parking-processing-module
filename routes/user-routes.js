const express = require("express");
const userController = require("../controllers/user-controller");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User endpoints
 */

/**
 * @swagger
 * /user/update-password:
 *   put:
 *     summary: Update user password
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               newPassword:
 *                 type: string
 *             required:
 *               - userId
 *               - newPassword
 *     responses:
 *       200:
 *         description: User password updated successfully
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
 *               operation: "update-password"
 *               success: true
 *       401:
 *         description: Unauthorized
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
 *               operation: "update-password"
 *               success: false
 *               error: "Invalid password"
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
 *               operation: "update-password"
 *               success: false
 *               error: "Internal Server Error"
 */
router.put("/update-password", userController.updateUserPassword);

/**
 * @swagger
 * /user/update-email:
 *   put:
 *     summary: Update user email
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               newEmail:
 *                 type: string
 *             required:
 *               - userId
 *               - newEmail
 *     responses:
 *       200:
 *         description: User email updated successfully
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
 *               operation: "update-email"
 *               success: true
 *       401:
 *         description: Unauthorized
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
 *               operation: "update-email"
 *               success: false
 *               error: "Email already in use"
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
 *               operation: "update-email"
 *               success: false
 *               error: "Internal Server Error"
 */
router.put("/update-email", userController.updateUserEmail);

/**
 * @swagger
 * /user/update-favourite-spot:
 *   put:
 *     summary: Update user's favourite parking spot
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               favouriteSpot:
 *                 type: string
 *             required:
 *               - userId
 *               - favouriteSpot
 *     responses:
 *       200:
 *         description: User's favourite parking spot updated successfully
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
 *               operation: "set-favourite-spot"
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
 *               operation: "set-favourite-spot"
 *               success: false
 *               error: "Internal Server Error"
 */
router.put("/update-favourite-spot", userController.setFavouriteParkingSpot);

/**
 * @swagger
 * /user/delete-user:
 *   delete:
 *     summary: Delete user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *             required:
 *               - userId
 *     responses:
 *       200:
 *         description: User deleted successfully
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
 *               operation: "delete-users"
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
 *               operation: "delete-users"
 *               success: false
 *               error: "Internal Server Error"
 */
router.delete("/delete-user", userController.deleteUser);

module.exports = router;
