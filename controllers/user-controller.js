const UserService = require("../services/user-service");

const db = require("../db-connection");

const userService = new UserService(db);


exports.getUserProfileById = async (req, res) => {};
exports.updateUserProfile = async (req, res) => {};
exports.setFavoriteParkingSpot = async (req, res) => {};
exports.deleteUser = async (req, res) => {};
