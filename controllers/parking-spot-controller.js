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

  console.log(latitude, longitude);
  try {
    const closestSpot = await parkingSpotService.getClosestFreeParkingSpot(
      latitude,
      longitude
    );

    if (closestSpot) {
      res.status(200).json(closestSpot);
    } else {
      res.status(404).json({ error: "No free parking spot found" });
    }
  } catch (error) {
    console.error(`Error while finding closest spot: ${error.message}`);
    res.status(500);
  }
};

exports.getUserFavouriteParkingSpot = async (req, res) => {
  try {
    const userId = req.params.userId;
    const favouriteSpot = await parkingSpotService.getUserFavouriteSpot(userId);

    if (favouriteSpot) {
      res.status(200).json({ favouriteSpot: favouriteSpot });
    } else {
      res.status(200).json({ favouriteSpot: null });
    }
  } catch (error) {
    console.error(
      `Error getting user's favourite parking spot: ${error.message}`
    );
    res.status(500);
  }
};

exports.getAllParkingSpots = async (req, res) => {
  try {
    const parkingSpots = await parkingSpotService.getAllParkingSpots();
    res.status(200).json(parkingSpots);
  } catch (error) {
    console.error(`Error while getting all parking spots: ${error.message}`);
    res.status(500);
  }
};

exports.getAllFreeParkingSpots = async (req, res) => {
  try {
    const freeParkingSpots = await parkingSpotService.getAllFreeParkingSpots();
    res.status(200).json(freeParkingSpots);
  } catch (error) {
    console.error(`Error while getting all free spot: ${error.message}`);
    res.status(500);
  }
};

exports.getParkingSpotCoordinates = async (req, res) => {
  const spotId = req.params.spotId;
  try {
    const spotCoordinates =
      await parkingSpotService.getParkingSpotCoordinatesById(spotId);
    res.status(200).json(spotCoordinates);
  } catch (error) {
    console.error(
      `Error while geting coordinates of spot ${spotId} - ${error.message}`
    );
    res.status(500);
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
    console.error(
      `Error while geting parking spoty by id ${spotId} - ${error.message}`
    );
    res.status(500);
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
    console.error(
      `Error getting detail of spot: ${spotId} error: ${error.message}`
    );
    res.status(500);
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
    console.error(
      `Error getting detail of spot: ${spotId} error: ${error.message}`
    );
    res.status(500);
  }
};
