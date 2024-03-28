const ParkingSpotHistoryService = require("../services/spot-history-service");

const db = require("../db-connection");

const parkingSpotHistoryService = new ParkingSpotHistoryService(db);

exports.getParkingSpotHistoryById = async (req, res) => {
  const spotId = req.params.spotId;
  try {
    const parkingSpotHistory =
      await parkingSpotHistoryService.getParkingSpotHistoryById(spotId);
    res.status(200).json({
      operation: "get-spot-history",
      parkingSpotHistory: parkingSpotHistory,
      success: true,
    });
  } catch (error) {
    console.error(
      `Error getting history for parking spot with ID ${spotId}: ${error.message}`
    );
    res.status(500).json({
      operation: "get-spot-history",
      error: error.message,
      success: false,
    });
  }
};

exports.getAllParkingSpotsOccupancyCount = async (req, res) => {
  try {
    const parkingSpotsOccupancyCount =
      await parkingSpotHistoryService.getHistoryOccupancyCount();
    res.status(200).json({
      operation: "get-all-occupancy-count",
      parkingSpotsOccupancyCount: parkingSpotsOccupancyCount,
      success: true,
    });
  } catch (error) {
    console.error(
      `Error getting occupancy count for all parking spots: ${error.message}`
    );
    res.status(500).json({
      operation: "get-all-occupancy-count",
      error: error.message,
      success: false,
    });
  }
};
