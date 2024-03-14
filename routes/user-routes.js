const express = require("express");
const router = express.Router();
const userController = require("../controllers/user-controller");

router.get("/profile/:userId", userController.getUserProfileById);

router.put("/update-password", userController.updateUserPassword);

router.put("/update-email", userController.updateUserEmail);

router.put("/update-favourite-spot", userController.setFavouriteParkingSpot);

router.delete("/delete/:userId", userController.deleteUser);

module.exports = router;