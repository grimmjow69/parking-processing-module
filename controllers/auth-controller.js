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
      const userId = await userService.addUser({
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
      console.log(`Login - SUCCESS`);
      return res.status(200).json({ loginSuccessfull: true, user: userData });
    } else {
      console.log(`Login - FAILED`);
      return res.status(401).json({ loginSuccessfull: false });
    }
  } catch (error) {
    console.error(`Error while user login: ${error}`);
    res.status(500);
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
      console.log(`Verify of user ${userId} - SUCCESS`);
      return res.status(200).json({ passwordVerified: true });
    } else {
      console.log(`Verify of user ${userId} - FAILED`);
      return res.status(401).json({ passwordVerified: false });
    }
  } catch (error) {
    console.error(`Error while verifing password: ${error}`);
    res.status(500);
  }
};

exports.logoutUser = async (req, res) => {};
