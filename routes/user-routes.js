const express = require("express");
const router = express.Router();
const userController = require("../controllers/user-controller");

router.get("/profile/:id", userController.getUserProfileById);

router.put("/update-profile", userController.updateUserProfile);

router.post("/set-favorite-spot/:spotId", userController.setFavoriteParkingSpot);

router.delete("/delete/:id", userController.deleteUser);

module.exports = router;