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
      console.log(`User: ${userId} not found`);
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(`Error getting user profile: ${userId} - ${error.message}`);
    res.status(500);
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const updateData = req.body;

    const existingUser = await userService.getUserByUserId(userId);

    if (existingUser) {
      await userService.updateUser(updateData);
      res.status(200);
    } else {
      console.log(`User: ${userId} not found`);
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(`Error updating user profile: ${userId} - ${error.message}`);
    res.status(500);
  }
};

exports.setFavouriteParkingSpot = async (req, res) => {
  try {
    const { userId, spotId } = req.body;

    await userService.updateFavouriteSpot(userId, spotId);
    console.log(
      `User: ${userId} favourite parking spot: ${spotId} set successfully`
    );
    res.status(201);
  } catch (error) {
    console.error(
      `Error setting favourite parking spot: ${spotId} of user: ${userId} - ${error.message}`
    );
    res.status(500);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const deleted = await userService.deleteUser(userId);

    if (deleted) {
      console.log(`User: ${userId} deleted successfuly`);
      res.status(200);
    } else {
      console.log(`User: ${userId} not found`);
      res.status(404);
    }
  } catch (error) {
    console.error(`Error while deleting user: ${userId} - ${error.message}`);
    res.status(500);
  }
};
