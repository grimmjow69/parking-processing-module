const RatingService = require("../services/rating-service");

const db = require("../db-connection");

const ratingService = new RatingService(db);

exports.getUserRatings = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userRatings = await ratingService.getAllUserRatingsByUserId(userId);

    res.status(200).json({ ratings: userRatings });
  } catch (error) {
    console.error("Error getting user ratings:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getSpotRatings = async (req, res) => {
  try {
    const parkingSpotId = req.params.parkingSpotId;
    const spotRatings =
      await ratingService.getAllParkingSpotRatingsByParkingSpotId(
        parkingSpotId
      );

    res.status(200).json({ ratings: spotRatings });
  } catch (error) {
    console.error("Error getting spot ratings:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.addSpotRating = async (req, res) => {
  try {
    const { userId, parkingSpotId, rating, comment } = req.body;

    await ratingService.addRating(userId, parkingSpotId, rating, comment);
    res
      .status(201)
      .json({ success: true, message: "Rating added successfully" });
  } catch (error) {
    console.error("Error adding spot rating:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteSpotRating = async (req, res) => {
  try {
    const ratingId = req.params.ratingId;

    await ratingService.deleteRatingById(ratingId);
    res
      .status(200)
      .json({ success: true, message: "Rating deleted successfully" });
  } catch (error) {
    console.error("Error deleting spot rating:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
