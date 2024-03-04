const UserService = require("../services/user-service");
const AuthService = require("../services/auth-service");
const db = require("../db-connection");

const userService = new UserService(db);
const authService = new AuthService(db);

exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const isCredentialsTaken = await userService.userCredentialsTakenCheck(
      username,
      email
    );
    if (isCredentialsTaken) {
      return res.status(400).json({ error: "Username or email already taken" });
    }

    const userId = await userService.addUser({
      username: username,
      email: email,
      password: password,
    });

    res.json({ userId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyPassword = async (req, res) => {
  const { userId, password } = req.body;

  const passwordVerified = await authService.verifyPassword(userId, password);

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

exports.loginUser = async (req, res) => {};
exports.logoutUser = async (req, res) => {};
