const express = require("express");

const router = express.Router();
const parkingController = require("../controllers/parking-spot-controller");

/**
 * @swagger
 * tags:
 *   name: Settings
 *   description: Settings endpoints
 */

/**
 * @swagger
 * /settings/update-coordinates/{spotId}:
 *   put:
 *     summary: Update parking spot coordinates
 *     description: Updates the latitude and longitude coordinates of a parking spot.
 *     tags: [Settings]
 *     parameters:
 *       - in: path
 *         name: spotId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the parking spot to update.
 *       - in: body
 *         name: coordinates
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             latitude:
 *               type: number
 *             longitude:
 *               type: number
 *         description: The new latitude and longitude coordinates of the parking spot.
 *     responses:
 *       '200':
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 operation:
 *                   type: string
 *                   example: update-coordinates
 *                 success:
 *                   type: boolean
 *                   example: true
 *       '500':
 *         description: Error response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 operation:
 *                   type: string
 *                   example: update-coordinates
 *                 error:
 *                   type: string
 *                   example: Error message
 *                 success:
 *                   type: boolean
 *                   example: false
 */
router.put(
  "/update-coordinates/:spotId",
  parkingController.updateParkingSpotCoordinates
);

/**
 * @swagger
 * /settings/create-spot:
 *   post:
 *     summary: Create a new parking spot
 *     description: Creates a new parking spot with the specified name and coordinates.
 *     tags: [Settings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *             required:
 *               - name
 *               - latitude
 *               - longitude
 *     responses:
 *       '201':
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 operation:
 *                   type: string
 *                   example: create-parking-spot
 *                 parkingSpot:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 12345
 *                     name:
 *                       type: string
 *                       example: Parking Spot 1
 *                     latitude:
 *                       type: number
 *                       example: 40.7128
 *                     longitude:
 *                       type: number
 *                       example: 40.7128
 *                 success:
 *                   type: boolean
 *                   example: true
 *       '500':
 *         description: Error response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 operation:
 *                   type: string
 *                   example: create-parking-spot
 *                 error:
 *                   type: string
 *                   example: Error message
 *                 success:
 *                   type: boolean
 *                   example: false
 */
router.post("/create-spot", parkingController.createParkingSpot);

module.exports = router;
