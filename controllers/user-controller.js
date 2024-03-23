const UserService = require("../services/user-service");
const AuthService = require("../services/auth-service");

const db = require("../db-connection");

const userService = new UserService(db);
const authService = new AuthService(db);

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

exports.updateUserPassword = async (req, res) => {
  try {
    const { userId, newPassword, password } = req.body;
    const passwordCheck = await authService.verifyPasswordWithUserId(
      userId,
      password
    );

    if (!passwordCheck) {
      res
        .status(401)
        .json({ success: false, error: "Password verification failed" });
    } else {
      const result = await userService.updateUserPassword(userId, newPassword);
      res
        .status(200)
        .json({ success: result, message: "Password updated succesfully" });
    }
  } catch (error) {
    console.error(`Error updating user password - ${error.message}`);
    res.status(500);
  }
};

exports.updateUserEmail = async (req, res) => {
  try {
    const { userId, newEmail, password } = req.body;

    const passwordCheck = await authService.verifyPasswordWithUserId(
      userId,
      password
    );

    if (!passwordCheck) {
      return res
        .status(401)
        .json({ success: false, error: "Password verification failed" });
    }

    const emailCheck = await userService.getUserByEmail(newEmail);

    if (emailCheck) {
      return res
        .status(409)
        .json({ success: false, error: "Email already in use" });
    } else {
      await userService.updateUserEmail(userId, newEmail);
      return res
        .status(200)
        .json({ success: true, message: "Email updated successfully" });
    }
  } catch (error) {
    console.error(`Error updating user email - ${error.message}`);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

exports.setFavouriteParkingSpot = async (req, res) => {
  try {
    const { userId, spotId } = req.body;

    await userService.updateUsersFavouriteSpot(userId, spotId);
    console.log(
      `User: ${userId} favourite parking spot: ${spotId} set successfully`
    );
    res.status(200).json({ success: true });
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
      res.status(200).json({ success: true });
    } else {
      console.log(`User: ${userId} not found`);
      res.status(404);
    }
  } catch (error) {
    console.error(`Error while deleting user: ${userId} - ${error.message}`);
    res.status(500);
  }
};
