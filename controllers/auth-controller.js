const UserService = require("../services/user-service");
const AuthService = require("../services/auth-service");
const { pool } = require("../db-connection");

const userService = new UserService();
const authService = new AuthService();

exports.registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const isCredentialsTaken = await userService.userCredentialsTakenCheck(
      email
    );

    if (isCredentialsTaken) {
      console.log("User credentials (email) already taken");
      return res
        .status(409)
        .json({
          operation: "register",
          error: "User credentials (email) already taken",
          success: false,
        });
    } else {
      const userId = await userService.registerNewUser({
        email: email,
        password: password,
      });

      console.log("Registration - SUCCESS");
      res
        .status(201)
        .json({ operation: "register", userId: userId, success: true });
    }
  } catch (error) {
    console.error(`Error while user registration: ${error}`);
    res.status(500).json({
      operation: "register",
      error: error.message,
      success: false,
    });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const passwordVerified = await authService.verifyPasswordWithEmail(
      email,
      password
    );
    if (passwordVerified) {
      const userData = await userService.getUserByEmail(email);
      console.log(
        `Login - SUCCESS: User with email ${email} logged in successfully`
      );
      return res.status(200).json({
        operation: "login",
        success: true,
        user: userData,
      });
    } else {
      console.log(`Login - FAILED`);
      return res.status(401).json({
        operation: "login",
        error: "Incorrect password",
        success: false,
      });
    }
  } catch (error) {
    console.error(`Error while logging in, user with email ${email}: ${error}`);
    res.status(500).json({
      operation: "login",
      error: error.message,
      success: false,
    });
  }
};

exports.verifyPassword = async (req, res) => {
  const { userId, password } = req.body;

  const passwordVerified = await authService.verifyPasswordWithUserId(
    userId,
    password
  );

  try {
    if (passwordVerified) {
      console.log(
        `Password verification - SUCCESS: User with ID ${userId} verified successfully`
      );
      return res.status(200).json({
        operation: "verify-password",
        success: true,
      });
    } else {
      console.log(
        `Password verification - FAILED: Incorrect password for user with ID ${userId}`
      );
      return res.status(401).json({
        operation: "verify-password",
        error: "Incorrect password",
        success: false,
      });
    }
  } catch (error) {
    console.error(
      `Error while verifying password for user with ID ${userId}: ${error}`
    );
    res.status(500).json({
      operation: "verify-password",
      error: error.message,
      success: false,
    });
  }
};
