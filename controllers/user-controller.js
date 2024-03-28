const UserService = require("../services/user-service");
const AuthService = require("../services/auth-service");
const NotificationService = require("../services/notification-service");

const db = require("../db-connection");

const userService = new UserService(db);
const authService = new AuthService(db);
const notificationService = new NotificationService(db);

exports.getUserProfileById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await userService.getUserByUserId(userId);

    if (user) {
      res.status(200).json({ user });
    } else {
      console.log(`User with ID ${userId} not found`);
      res.status(404).json({ error: `User with ID ${userId} not found` });
    }
  } catch (error) {
    console.error(
      `Error getting profile for user with ID ${userId}: ${error.message}`
    );
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
      res.status(401).json({
        success: false,
      });
    } else {
      const result = await userService.updateUserPassword(userId, newPassword);
      res.status(200).json({
        success: result,
      });
    }
  } catch (error) {
    console.error(
      `Error updating password for user with ID ${userId}: ${error.message}`
    );
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
      return res.status(401).json({
        success: false,
      });
    }

    const emailCheck = await userService.getUserByEmail(newEmail);

    if (emailCheck) {
      return res.status(409).json({
        success: false,
      });
    } else {
      await userService.updateUserEmail(userId, newEmail);
      return res.status(200).json({
        success: true,
      });
    }
  } catch (error) {
    console.error(
      `Error updating email for user with ID ${userId}: ${error.message}`
    );
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
      `User with ID ${userId} set parking spot with ID ${spotId} as favourite successfully`
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(
      `Error setting parking spot with ID ${spotId} as favourite for user with ID ${userId}: ${error.message}`
    );
    res.status(500);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;
    await notificationService.deleteNotificationsByUserId(userId);
    const deleted = await userService.deleteUser(userId);

    if (deleted) {
      console.log(`User with ID ${userId} deleted successfully`);
      res.status(200).json({ success: true });
    } else {
      console.log(`User with ID ${userId} not found`);
      res.status(404);
    }
  } catch (error) {
    console.error(
      `Error while deleting user with ID ${userId}: ${error.message}`
    );
    res.status(500);
  }
};
