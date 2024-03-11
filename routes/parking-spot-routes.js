const express = require("express");
const router = express.Router();
const parkingController = require("../controllers/parking-spot-controller");
const parkingHistoryController = require("../controllers/parking-spot-history-controller");

router.get("/all-spots", parkingController.getAllParkingSpots);

router.get("/spot-by-id/:spotId", parkingController.getParkingSpotById);

router.get(
  "/spot-coordinates/:spotId",
  parkingController.getParkingSpotCoordinates
);

router.get("/spot-by-name/:name", parkingController.getParkingSpotByName);

router.get(
  "/history/:spotId",
  parkingHistoryController.getParkingSpotHistoryById
);

router.get(
  "/heatmap",
  parkingHistoryController.getAllParkingSpotsOccupancyCount
);

router.post("/spot-detail-by-id", parkingController.getSpotDetailById);

router.post(
  "/find-closest-free-spot",
  parkingController.getClosestFreeParkingSpot
);

router.get(
  "/favourite-spot/:userId",
  parkingController.getUserFavouriteParkingSpot
);

module.exports = router;
