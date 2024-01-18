const express = require("express");
const router = express.Router();
const userController = require("../controllers/user-controller");

router.get("/profile/:id", userController.getUserProfileById);

router.put("/update-profile", userController.updateUserProfile);

router.post("/set-favorite-spot", userController.setFavoriteParkingSpot);

router.delete("/unregister", userController.unregisterUser);

module.exports = router;