const ParkingSpotService = require("../services/parking-spot-service");
const ParkingSpotHistoryService = require("../services/spot-history-service");
const UserService = require("../services/user-service");
const NotificationService = require("../services/notification-service");

const db = require("../db-connection");

const parkingSpotService = new ParkingSpotService(db);
const parkingSpotHistoryService = new ParkingSpotHistoryService(db);
const userService = new UserService(db);
const notificationService = new NotificationService(db);

exports.getClosestFreeParkingSpot = async (req, res) => {
  const { latitude, longitude } = req.body;

  console.log(latitude, longitude)
  try {
    const closestSpot = await parkingSpotService.getClosestFreeParkingSpot(
      latitude,
      longitude
    );

    if (closestSpot) {
      res.json(closestSpot);
    } else {
      res.status(404).json({ error: "No free parking spot found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserFavouriteParkingSpot = async (req, res) => {
  try {
    const userId = req.params.userId;
    const favouriteSpot = await parkingSpotService.getUserFavouriteSpot(
      userId
    );

    if (favouriteSpot) {
      res.status(200).json({ favouriteSpot: favouriteSpot });
    } else {
      res.status(200).json({ favouriteSpot: null });
    }
  } catch (error) {
    console.error(
      "Error getting user's favourite parking spot:",
      error.message
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.getAllParkingSpots = async (req, res) => {
  try {
    const parkingSpots = await parkingSpotService.getAllParkingSpots();
    res.status(200).json(parkingSpots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllFreeParkingSpots = async (req, res) => {
  try {
    const freeParkingSpots = await parkingSpotService.getAllFreeParkingSpots();
    res.status(200).json(freeParkingSpots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getParkingSpotCoordinates = async (req, res) => {
  const spotId = req.params.spotId;
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

exports.getSpotDetailById = async (req, res) => {
  try {
    const userId = req.body.userId;
    const spotId = req.body.spotId;

    const result = {
      isFavourite: false,
      isNotificationEnabled: false,
      history: [],
    };

    const user = await userService.getUserByUserId(userId);
    if (user && user.favouriteSpotId === spotId) {
      result.isFavourite = true;
    }

    const notifications = await notificationService.getAllUserNotifications(
      userId
    );
    if (
      notifications.some(
        (notification) => notification.parkingSpotId === spotId
      )
    ) {
      result.isNotificationEnabled = true;
    }

    const historyRecords =
      await parkingSpotHistoryService.getParkingSpotHistoryById(spotId);

    if (historyRecords) {
      const first10Records = historyRecords.slice(0, 50);
      first10Records.forEach((record) => {
        result.history.push({
          occupied: record.occupied,
          updatedAt: record.updatedAt,
        });
      });
    }
    res.status(200).json({ data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
