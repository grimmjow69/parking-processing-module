const express = require("express");
const parkingController = require("../controllers/parking-spot-controller");
const parkingHistoryController = require("../controllers/parking-spot-history-controller");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Parking
 *   description: Parking endpoints
 */

/**
 * @swagger
 * /parking/parking-spots:
 *   get:
 *     summary: Get all parking spots
 *     tags: [Parking]
 *     responses:
 *       '200':
 *         description: Parking spots retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 operation:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       parkiningSpotId:
 *                         type: string
 *                       name:
 *                         type: string
 *                       occupied:
 *                         type: boolean
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       latitude:
 *                         type: number
 *                       longitude:
 *                         type: number
 *                 success:
 *                   type: boolean
 *             example:
 *               operation: "get-all-spots"
 *               success: true
 *               data: [
 *                 {
 *                   parkiningSpotId: "1",
 *                   name: "Spot 1",
 *                   occupied: false,
 *                   updatedAt: "2021-09-01T12:00:00Z",
 *                   latitude: 1.234,
 *                   longitude: 5.678
 *                 },
 *                 {
 *                   parkiningSpotId: "2",
 *                   name: "Spot 2",
 *                   occupied: true,
 *                   updatedAt: "2021-09-01T12:00:00Z",
 *                   latitude: 1.234,
 *                   longitude: 5.678
 *                 }
 *               ]
 *       '500':
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
 *               operation: "get-all-spots"
 *               success: false
 *               error: "Internal Server Error"
 */
router.get("/parking-spots", parkingController.getAllParkingSpots);

/**
 * @swagger
 * /parking/spot-by-id/{spotId}:
 *   get:
 *     summary: Get parking spot by ID
 *     tags: [Parking]
 *     parameters:
 *       - in: path
 *         name: spotId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Parking spot found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 operation:
 *                   type: string
 *                 parkingSpot:
 *                   type: object
 *                   properties:
 *                     parkingSpotId:
 *                       type: string
 *                     name:
 *                       type: string
 *                     occupied:
 *                       type: boolean
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     longitude:
 *                       type: number
 *                     latitude:
 *                       type: number
 *                 success:
 *                   type: boolean
 *             example:
 *               operation: "get-spot-by-id"
 *               success: true
 *               parkingSpot: { parkingSpotId: "1", name: "Spot 1", occupied: false, updatedAt: "2023-01-01T12:00:00Z", latitude: 1.234, longitude: 5.678 }
 *       '404':
 *         description: Parking spot not found
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
 *               operation: "get-spot-by-id"
 *               success: false
 *               error: "Parking spot not found"
 *       '500':
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
 *               operation: "get-spot-by-id"
 *               success: false
 *               error: "Internal Server Error"
 */
router.get("/spot-by-id/:spotId", parkingController.getParkingSpotById);

/**
 * @swagger
 * /parking/spot-by-name/{name}:
 *   get:
 *     summary: Get parking spot by name
 *     tags: [Parking]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the parking spot
 *     responses:
 *       '200':
 *         description: Parking spot found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 operation:
 *                   type: string
 *                 parkingSpot:
 *                   type: object
 *                   properties:
 *                     parkingSpotId:
 *                       type: string
 *                     name:
 *                       type: string
 *                     occupied:
 *                       type: boolean
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                 success:
 *                   type: boolean
 *             example:
 *               operation: "get-spot-by-name"
 *               success: true
 *               parkingSpot: { parkingSpotId: "1", name: "Spot 1", occupied: false, updatedAt: "2023-01-01T12:00:00Z" }
 *       '404':
 *         description: Parking spot not found
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
 *               operation: "get-spot-by-name"
 *               success: false
 *               error: "Parking spot not found"
 *       '500':
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
 *               operation: "get-spot-by-name"
 *               success: false
 *               error: "Internal Server Error"
 */
router.get("/spot-by-name/:name", parkingController.getParkingSpotByName);

/**
 * @swagger
 * /parking/heatmap:
 *   get:
 *     summary: Get heatmap based on parking spots occupancy count
 *     tags: [Parking]
 *     responses:
 *       '200':
 *         description: Heatmap generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 operation:
 *                   type: string
 *                 parkingSpotsOccupancyCount:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       weight:
 *                         type: number
 *                       longitude:
 *                         type: number
 *                       latitude:
 *                         type: number
 *             example:
 *               operation: "heatmap-generation"
 *               parkingSpotsOccupancyCount: [ { weight: 1, latitude: 1.234, longitude: 5.678 }, { weight: 2, latitude: 1.234, longitude: 5.678 }]
 *               success: false
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
 *               operation: "heatmap-generation"
 *               success: false
 *               error: "Internal Server Error"
 */
router.get(
  "/heatmap",
  parkingHistoryController.getAllParkingSpotsOccupancyCount
);

/**
 * @swagger
 * /parking/spot-detail:
 *   post:
 *     summary: Get detail of parking spot by user ID and spot ID
 *     tags: [Parking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               spotId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Detail of parking spot retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 operation:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     isFavourite:
 *                       type: boolean
 *                     isNotificationEnabled:
 *                       type: boolean
 *                     stateSince:
 *                       type: string
 *                       format: date-time
 *                 success:
 *                   type: boolean
 *             example:
 *               operation: "get-spot-detail"
 *               success: true
 *               data: { isFavourite: true, isNotificationEnabled: false, stateSince: "2024-01-01T12:00:00Z" }
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
 *               operation: "get-spot-detail"
 *               success: false
 *               error: "Internal Server Error"
 */
router.post("/spot-detail", parkingController.getSpotDetailById);

/**
 * @swagger
 * /parking/closest-free-spot:
 *   post:
 *     summary: Get closest free parking spot based on coordinates
 *     tags: [Parking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       200:
 *         description: Closest free parking spot found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 operation:
 *                   type: string
 *                 closestFreeSpot:
 *                   type: object
 *                 success:
 *                   type: boolean
 *             example:
 *               operation: "get-closest-free-spot"
 *               success: true
 *               closestFreeSpot: { latitude: 1.234, longitude: 5.678 }
 *       404:
 *         description: No free parking spot found
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
 *               operation: "get-closest-free-spot"
 *               success: false
 *               error: "No free parking spot found"
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
 *               operation: "get-closest-free-spot"
 *               success: false
 *               error: "Internal Server Error"
 */
router.post(
  "/closest-free-spot",
  parkingController.getClosestFreeParkingSpot
);


/**
 * @swagger
 * /parking/user-favourite-spot/{userId}:
 *   get:
 *     summary: Get user's favourite parking spot
 *     tags: [Parking]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User's favourite parking spot found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 operation:
 *                   type: string
 *                 favouriteSpot:
 *                   type: object
 *                   properties:
 *                     parkingSpotId:
 *                       type: string
 *                     name:
 *                       type: string
 *                     occupied:
 *                       type: boolean
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     longitude:
 *                       type: number
 *                     latitude:
 *                       type: number
 *                 success:
 *                   type: boolean
 *             example:
 *               operation: "get-user-favourite-spot"
 *               success: true
 *               favouriteSpot: { parkingSpotId: "1", name: "Spot 1", occupied: false, updatedAt: "2024-01-01T12:00:00Z", latitude: 1.234, longitude: 5.678 }
 *       404:
 *         description: User has no favourite parking spot
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 operation:
 *                   type: string
 *                 favouriteSpot:
 *                   type: null
 *                 error:
 *                   type: string
 *                 success:
 *                   type: boolean
 *             example:
 *               operation: "get-user-favourite-spot"
 *               success: false
 *               error: "User has no favourite parking spot"
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
 *               operation: "get-user-favourite-spot"
 *               success: false
 *               error: "Internal Server Error"
 */
router.get(
  "/user-favourite-spot/:userId",
  parkingController.getUserFavouriteParkingSpot
);

/**
 * @swagger
 * /parking/spot-history/{spotId}:
 *   get:
 *     summary: Get history of parking spot by spot ID
 *     tags: [Parking]
 *     parameters:
 *       - in: path
 *         name: spotId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: History of parking spot retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 operation:
 *                   type: string
 *                 historyRecords:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       occupied:
 *                         type: boolean
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 success:
 *                   type: boolean
 *             example:
 *               operation: "get-spot-history"
 *               success: false
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
 *               operation: "get-spot-history"
 *               success: false
 *               error: "Internal Server Error"
 */
router.get("/spot-history/:spotId", parkingController.getSpotHistoryById);

module.exports = router;
