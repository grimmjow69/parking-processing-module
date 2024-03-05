const ParkingSpotHistoryService = require("../services/spot-history-service");

const db = require("../db-connection");

const parkingSpotHistoryService = new ParkingSpotHistoryService(db);

exports.getParkingSpotHistoryById = async (req, res) => {
  const spotId = req.params.spotId;
  try {
    const parkingSpotHistory =
      await parkingSpotHistoryService.getParkingSpotHistoryById(spotId);
    res.json(parkingSpotHistory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllParkingSpotsOccupancyCount = async (req, res) => {
  // return how many times each parking spot was occupied (take all records from history table)
  try {
    const parkingSpotsOccupancyCount =
      await parkingSpotHistoryService.getHistoryOccupancyCount();
    res.json(parkingSpotsOccupancyCount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
