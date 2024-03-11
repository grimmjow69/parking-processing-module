const UserService = require("../services/user-service");

const db = require("../db-connection");

const userService = new UserService(db);

exports.getUserProfileById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await userService.getUserByUserId(userId);

    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error getting user profile:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const updateData = req.body;

    const existingUser = await userService.getUserByUserId(userId);

    if (existingUser) {
      await userService.updateUser(updateData);
      res
        .status(200)
        .json({ success: true, message: "User profile updated successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user profile:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.setFavouriteParkingSpot = async (req, res) => {
  try {
    const { userId, spotId } = req.body;

    await userService.updateFavouriteSpot(userId, spotId);
    res.status(200).json({
      success: true,
      message: "Favourite parking spot set successfully",
    });
  } catch (error) {
    console.error("Error setting favourite parking spot:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const deleted = await userService.deleteUser(userId);

    if (deleted) {
      res
        .status(200)
        .json({ success: true, message: "User deleted successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
