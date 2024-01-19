const ParkingSpotHistoryService = require("../services/spot-history-service");

const db = require("../db-connection");

const parkingSpotHistoryService = new ParkingSpotHistoryService(db);

exports.getParkingSpotHistroyById = async (req, res) => {};