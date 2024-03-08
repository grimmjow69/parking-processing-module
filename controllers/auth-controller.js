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
      return res.status(400).json({ error: "emailAlreadyTaken" });
    }

    const userId = await userService.addUser({
      email: email,
      password: password,
    });

    res.json({ userId });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
      return res.status(200).json({ loginSuccessfull: true, user: userData });
    } else {
      return res.status(401).json({ loginSuccessfull: false });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
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
      return res.status(200).json({ passwordVerified: true });
    } else {
      return res.status(401).json({ passwordVerified: false });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.logoutUser = async (req, res) => {};
