const express = require("express");
const router = express.Router();
const parkingController = require("../controllers/parking-spot-controller");
const parkingHistoryController = require("../controllers/parking-spot-history-controller");

router.get("/all-spots", parkingController.getAllParkingSpots);

router.get("/spot-by-id/:id", parkingController.getParkingSpotById);

router.get("/spot-by-name/:name", parkingController.getParkingSpotByName);

router.get("/history/:id", parkingHistoryController.getParkingSpotHistroyById);

module.exports = router;