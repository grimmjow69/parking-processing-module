const ParkingSpotService = require("../services/parking-spot-service");

const db = require("../db-connection");

const parkingSpotService = new ParkingSpotService(db);

exports.getAllParkingSpots = async (req, res) => {
  try {
    const parkingSpots = await parkingSpotService.getAllParkingSpots();
    res.status(200).json(parkingSpots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getParkingSpotCoordinates = async (req, res) => {
  const spotId = req.params.spotId;
  console.log(spotId)
  try {
    const spotCoordinates =
      await parkingSpotService.getParkingSpotCoordinatesById(spotId);
    res.status(200).json(spotCoordinates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getParkingSpotById = async (req, res) => {
  const spotId = req.params.spotId;
  try {
    const parkingSpot = await parkingSpotService.getParkingSpotById(spotId);
    if (parkingSpot) {
      res.json(parkingSpot);
    } else {
      res.status(404).json({ error: "Parking spot not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getParkingSpotByName = async (req, res) => {
  const spotName = req.params.name;
  try {
    const parkingSpot = await parkingSpotService.getParkingSpotByName(spotName);
    if (parkingSpot) {
      res.json(parkingSpot);
    } else {
      res.status(404).json({ error: "Parking spot not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
