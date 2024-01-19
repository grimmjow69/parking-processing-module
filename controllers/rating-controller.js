const RatingService = require("../services/rating-service");

const db = require("../db-connection");

const ratingService = new RatingService(db);

exports.getUserRatings = async (req, res) => {};
exports.getSpotRatings = async (req, res) => {};
exports.addSpotRating = async (req, res) => {};
exports.deleteSpotRating = async (req, res) => {};