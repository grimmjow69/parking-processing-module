const UserService = require("../services/user-service");
const AuthService = require("../services/auth-service");
const db = require("../db-connection");

const userService = new UserService(db);
const authService = new AuthService(db);


exports.registerUser = async (req, res) => {};
exports.loginUser = async (req, res) => {};
exports.logoutUser = async (req, res) => {};
