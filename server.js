const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();

app.use(express.json());

const cron = require("node-cron");
const authRoutes = require("./routes/auth-routes");
const notificationRoutes = require("./routes/notification-routes");
const parkingSpotRoutes = require("./routes/parking-spot-routes");
const userRoutes = require("./routes/user-routes");
const ExternalApiService = require("./services/external-api.service");

app.use("/auth", authRoutes);
app.use("/notification", notificationRoutes);
app.use("/parking", parkingSpotRoutes);
app.use("/user", userRoutes);

const externalApiService = new ExternalApiService();

app.listen(process.env.PORT, function () {
  console.log(`Server running on port ${process.env.PORT}`);
});

cron.schedule("*/1 * * * *", async () => {
  try {
    await externalApiService.updateParkingLotsWithNewData();
    console.log("Parking spots updated successfully.");
  } catch (error) {
    console.error("Error while updating parking spots:", error.message);
  }
});
