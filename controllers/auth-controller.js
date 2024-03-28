const UserService = require("../services/user-service");
const AuthService = require("../services/auth-service");
const db = require("../db-connection");

const userService = new UserService(db);
const authService = new AuthService(db);

exports.registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const isCredentialsTaken = await userService.userCredentialsTakenCheck(
      email
    );

    if (isCredentialsTaken) {
      console.log("User credentials (email) already taken");
      return res.status(409).json({ error: "emailAlreadyTaken" });
    } else {
      const userId = await userService.registerNewUser({
        email: email,
        password: password,
      });

      console.log("Registration - SUCCESS");
      res.status(201).json({ userId });
    }
  } catch (error) {
    console.error(`Error while user registration: ${error}`);
    res.status(500);
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
      return res.status(200).json({ success: true, user: userData });
    } else {
      console.log(`Login - FAILED`);
      return res.status(401).json({ success: false });
    }
  } catch (error) {
    console.error(`Error while logging in, user with email ${email}: ${error}`);
    res.status(500).json({ success: false });
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
      return res.status(200).json({ passwordVerified: true });
    } else {
      console.log(
        `Password verification - FAILED: Incorrect password for user with ID ${userId}`
      );
      return res.status(401).json({ passwordVerified: false });
    }
  } catch (error) {
    console.error(
      `Error while verifying password for user with ID ${userId}: ${error}`
    );
    res.status(500);
  }
};

exports.logoutUser = async (req, res) => {};
