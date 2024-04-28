const UserService = require("../services/user-service");
const AuthService = require("../services/auth-service");
const NotificationService = require("../services/notification-service");

const userService = new UserService();
const authService = new AuthService();
const notificationService = new NotificationService();

exports.getUserProfileById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await userService.getUserByUserId(userId);

    if (user) {
      res.status(200).json({
        operation: "get-profile",
        user: user,
        success: true,
      });
    } else {
      console.log(`User with ID ${userId} not found`);
      res.status(404).json({
        operation: "get-profile",
        success: false,
        error: `User with ID ${userId} not found`,
      });
    }
  } catch (error) {
    console.error(
      `Error getting profile for user with ID ${userId}: ${error.message}`
    );
    res.status(500).json({
      operation: "get-profile",
      success: false,
      error: error.message,
    });
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
        operation: "update-password",
        error: "Invalid password",
        success: false,
      });
    } else {
      const result = await userService.updateUserPassword(userId, newPassword);
      res.status(200).json({
        operation: "update-password",
        success: result,
      });
    }
  } catch (error) {
    console.error(
      `Error updating password for user with ID ${userId}: ${error.message}`
    );
    res.status(500).json({
      operation: "update-password",
      error: error.message,
      success: false,
    });
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
        operation: "update-email",
        success: false,
      });
    }

    const emailCheck = await userService.getUserByEmail(newEmail);

    if (emailCheck) {
      return res.status(409).json({
        operation: "update-email",
        error: "Email already in use",
        success: false,
      });
    } else {
      await userService.updateUserEmail(userId, newEmail);
      return res.status(200).json({
        operation: "update-email",
        success: true,
      });
    }
  } catch (error) {
    console.error(
      `Error updating email for user with ID ${userId}: ${error.message}`
    );
    return res.status(500).json({
      operation: "update-email",
      error: error.message,
      success: false,
    });
  }
};

exports.setFavouriteParkingSpot = async (req, res) => {
  try {
    const { userId, spotId } = req.body;

    await userService.updateUsersFavouriteSpot(userId, spotId);
    console.log(
      `User with ID ${userId} set parking spot with ID ${spotId} as favourite successfully`
    );
    res.status(200).json({ operation: "set-favourite-spot", success: true });
  } catch (error) {
    console.error(
      `Error setting parking spot with ID ${spotId} as favourite for user with ID ${userId}: ${error.message}`
    );
    res.status(500).json({
      operation: "set-favourite-spot",
      error: error.message,
      success: false,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;
    await notificationService.deleteNotificationsByUserId(userId);
    const deleted = await userService.deleteUser(userId);

    if (deleted) {
      console.log(`User with ID ${userId} deleted successfully`);
      res.status(200).json({ operation: "delete-user", success: true });
    } else {
      console.log(`User with ID ${userId} not found`);
      res.status(404).json({
        operation: "delete-user",
        error: "User not found",
        success: false,
      });
    }
  } catch (error) {
    console.error(
      `Error while deleting user with ID ${userId}: ${error.message}`
    );
    res.status(500).json({
      operation: "delete-user",
      error: error.message,
      success: false,
    });
  }
};
