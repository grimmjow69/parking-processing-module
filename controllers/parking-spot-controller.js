const ParkingSpotService = require("../services/parking-spot-service");
const ParkingSpotHistoryService = require("../services/spot-history-service");
const UserService = require("../services/user-service");
const NotificationService = require("../services/notification-service");

const { pool } = require("../db-connection");

const parkingSpotService = new ParkingSpotService();
const parkingSpotHistoryService = new ParkingSpotHistoryService();
const userService = new UserService();
const notificationService = new NotificationService();

exports.getClosestFreeParkingSpot = async (req, res) => {
  const { latitude, longitude } = req.body;

  try {
    const closestFreeSpot = await parkingSpotService.getClosestFreeParkingSpot(
      latitude,
      longitude
    );

    if (closestFreeSpot) {
      res.status(200).json({
        operation: "get-closest-free-spot",
        closestFreeSpot: closestFreeSpot,
        success: true,
      });
    } else {
      res.status(404).json({
        operation: "get-closest-free-spot",
        error: "No free parking spot found",
        success: false,
      });
    }
  } catch (error) {
    console.error(
      `Error while finding closest free parking spot from coordinates (${latitude}, ${longitude}): ${error.message}`
    );
    res.status(500).json({
      operation: "get-closest-free-spot",
      error: error.message,
      success: false,
    });
  }
};

exports.getUserFavouriteParkingSpot = async (req, res) => {
  try {
    const userId = req.params.userId;
    const favouriteSpot = await parkingSpotService.getUserFavouriteSpot(userId);

    if (favouriteSpot) {
      res.status(200).json({
        operation: "get-user-favourite-spot",
        favouriteSpot: favouriteSpot,
        success: true,
      });
    } else {
      res.status(404).json({
        operation: "get-user-favourite-spot",
        favouriteSpot: null,
        error: "User has no favourite parking spot",
        success: true,
      });
    }
  } catch (error) {
    console.error(
      `Error getting favourite parking spot for user with ID ${userId}: ${error.message}`
    );
    res.status(500).json({
      operation: "get-user-favourite-spot",
      error: error.message,
      success: false,
    });
  }
};

exports.getAllParkingSpots = async (req, res) => {
  try {
    const parkingSpots = await parkingSpotService.getAllParkingSpots();
    const updatedAt =
      await parkingSpotService.getLastDateOfLastSuccessfulUpdate();

    res.status(200).json({
      operation: "get-all-spots",
      updatedAt: updatedAt,
      data: parkingSpots,
      success: true,
    });
  } catch (error) {
    console.error(`Error while getting all parking spots: ${error.message}`);
    res.status(500).json({
      operation: "get-all-spots",
      error: error.message,
      success: false,
    });
  }
};

exports.getAllFreeParkingSpots = async (req, res) => {
  try {
    const freeParkingSpots = await parkingSpotService.getAllFreeParkingSpots();
    res.status(200).json({
      operation: "get-all-free-spots",
      freeParkingSpots: freeParkingSpots,
      success: true,
    });
  } catch (error) {
    console.error(
      `Error while getting all free parking spots: ${error.message}`
    );
    res.status(500).json({
      operation: "get-all-free-spots",
      error: error.message,
      success: false,
    });
  }
};


exports.getParkingSpotById = async (req, res) => {
  const spotId = req.params.spotId;
  try {
    const parkingSpot = await parkingSpotService.getParkingSpotById(spotId);
    if (parkingSpot) {
      res.json(parkingSpot);
      res.status(200).json({
        operation: "get-spot-by-id",
        parkingSpot: parkingSpot,
        success: true,
      });
    } else {
      res.status(404).json({
        operation: "get-spot-by-id",
        error: "Parking spot not found",
        success: false,
      });
    }
  } catch (error) {
    console.error(
      `Error while getting parking spot by ID ${spotId}: ${error.message}`
    );
    res.status(500).json({
      operation: "get-spot-by-id",
      error: error.message,
      success: false,
    });
  }
};

exports.getParkingSpotByName = async (req, res) => {
  const spotName = req.params.name;
  try {
    const parkingSpot = await parkingSpotService.getParkingSpotByName(spotName);
    if (parkingSpot) {
      res.status(200).json({
        operation: "get-spot-by-name",
        parkingSpot: parkingSpot,
        success: true,
      });
    } else {
      res.status(404).json({
        operation: "get-spot-by-name",
        error: "Parking spot not found",
        success: false,
      });
    }
  } catch (error) {
    console.error(
      `Error getting parking spot by name ${spotName}: ${error.message}`
    );
    res.status(500).json({
      operation: "get-spot-by-name",
      error: error.message,
      success: false,
    });
  }
};

exports.getSpotDetailById = async (req, res) => {
  try {
    const userId = req.body.userId;
    const spotId = req.body.spotId;

    const result = {
      isFavourite: false,
      isNotificationEnabled: false,
      stateSince: null,
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

    const lastStateChange =
      await parkingSpotHistoryService.getTimeSinceStatusChange(spotId);

    result.stateSince = lastStateChange;

    res
      .status(200)
      .json({ operation: "get-spot-detail", data: result, success: true });
  } catch (error) {
    console.error(
      `Error getting detail of parking spot with ID ${spotId} for user with ID ${userId}: ${error.message}`
    );
    res.status(500).json({
      operation: "get-spot-detail",
      error: error.message,
      success: false,
    });
  }
};

exports.getSpotHistoryById = async (req, res) => {
  try {
    const spotId = req.params.spotId;

    const historyRecords =
      await parkingSpotHistoryService.getParkingSpotHistoryById(spotId);

    res.status(200).json({
      operation: "get-spot-history",
      historyRecords: historyRecords,
      success: true,
    });
  } catch (error) {
    console.error(
      `Error getting history of parking spot with ID ${spotId}: ${error.message}`
    );
    res.status(500).json({
      operation: "get-spot-history",
      error: error.message,
      success: false,
    });
  }
};

exports.createParkingSpot = async (req, res) => {
  try {
    const { name, latitude, longitude } = req.body;

    const newParkingSpot = await parkingSpotService.createParkingSpot(
      name,
      latitude,
      longitude
    );

    res.status(201).json({
      operation: "create-parking-spot",
      parkingSpot: newParkingSpot,
      success: true,
    });
  } catch (error) {
    console.error(`Error creating parking spot: ${error.message}`);
    res.status(500).json({
      operation: "create-parking-spot",
      error: error.message,
      success: false,
    });
  }
};

exports.updateParkingSpotCoordinates = async (req, res) => {
  try {
    const spotId = req.params.spotId;
    const { latitude, longitude } = req.body;

    await parkingSpotService.updateParkingSpotCoordinates(
      spotId,
      latitude,
      longitude
    );

    res.status(200).json({
      operation: "update-coordinates",
      success: true,
    });
  } catch (error) {
    console.error(
      `Error updating coordinates for parking spot with ID ${spotId}: ${error.message}`
    );
    res.status(500).json({
      operation: "update-coordinates",
      error: error.message,
      success: false,
    });
  }
};
