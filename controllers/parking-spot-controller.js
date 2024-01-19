const UserService = require("../services/user-service");
const ParkingSpotService = require("../services/parking-spot-service");

const db = require("../db-connection");

const userService = new UserService(db);
const parkingSpotService = new ParkingSpotService(db);

exports.getAllParkingSpots = async (req, res) => {};
exports.getParkingSpotById = async (req, res) => {};
exports.getParkingSpotByName = async (req, res) => {};