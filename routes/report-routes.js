const express = require("express");
const reportController = require("../controllers/report-controller");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Report
 *   description: Report endpoints
 */

/**
 * @swagger
 * /report/save-report:
 *   post:
 *     summary: Save a report
 *     tags: [Report]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               reportMessage:
 *                 type: string
 *               category:
 *                 type: string
 *             example:
 *               userId: "user123"
 *               reportMessage: "This is a report"
 *               category: "General"
 *     responses:
 *       200:
 *         description: Report saved successfully
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
 *               operation: "save-report"
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
 *               operation: "save-report"
 *               success: false
 *               error: "Internal Server Error"
 */
router.post("/save-report", reportController.saveReport);

module.exports = router;
