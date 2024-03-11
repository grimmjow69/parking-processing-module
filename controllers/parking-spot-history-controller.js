const ParkingSpotHistoryService = require("../services/spot-history-service");

const db = require("../db-connection");

const parkingSpotHistoryService = new ParkingSpotHistoryService(db);

exports.getParkingSpotHistoryById = async (req, res) => {
  const spotId = req.params.spotId;
  try {
    const parkingSpotHistory =
      await parkingSpotHistoryService.getParkingSpotHistoryById(spotId);
    res.status(200).json(parkingSpotHistory);
  } catch (error) {
    console.error(`Error get parking spot history by id: ${error.message}`);
    res.status(500);
  }
};

exports.getAllParkingSpotsOccupancyCount = async (req, res) => {
  try {
    const parkingSpotsOccupancyCount =
      await parkingSpotHistoryService.getHistoryOccupancyCount();
    res.status(200).json(parkingSpotsOccupancyCount);
  } catch (error) {
    console.error(
      `Error getting all parking spot occupancy count: ${error.message}`
    );
    res.status(500);
  }
};
