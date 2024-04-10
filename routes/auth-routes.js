const express = require("express");
const authController = require("../controllers/auth-controller");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registers a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 operation:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 success:
 *                   type: boolean
 *             example:
 *               operation: "register"
 *               success: true
 *               userId: "1"
 *       409:
 *         description: User credentials already taken
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
 *               operation: "register"
 *               success: false
 *               error: "User credentials (email) already taken"
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
 *               operation: "register"
 *               success: false
 *               error: "Internal Server Error"
 */
router.post("/register", authController.registerUser);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 operation:
 *                   type: string
 *                 success:
 *                   type: boolean
 *                 user:
 *                   type: object
 *             example:
 *               operation: "login"
 *               success: true
 *               user: { user_id: "1", email: "xd@gmail.com", created_at: "2023-01-01T00:00:00.000Z", updated_at: "2024-01-01T00:00:00.000Z", favourite_spot_id: "1", push_token: "123456"}
 *       401:
 *         description: Incorrect password
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
 *               operation: "login"
 *               success: false
 *               error: "Incorrect password"
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
 *               operation: "login"
 *               success: false
 *               error: "Internal Server Error"
 */
router.post("/login", authController.loginUser);

/**
 * @swagger
 * /auth/verify-password:
 *   post:
 *     summary: Verifies a user's password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password verified successfully
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
 *               operation: "verify-password"
 *               success: success
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
 *               operation: "verify-password"
 *               success: false
 *               error: "Incorrect password"
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
 *               operation: "verify-password"
 *               success: false
 *               error: "Internal Server Error"
 */
router.post("/verify-password", authController.verifyPassword);

module.exports = router;
