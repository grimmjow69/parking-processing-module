const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();

app.use(express.json());

const db = require("./db-connection");

const cron = require("node-cron");
const authRoutes = require("./routes/auth-routes");
const notificationRoutes = require("./routes/notification-routes");
const parkingSpotRoutes = require("./routes/parking-spot-routes");
const userRoutes = require("./routes/user-routes");

const ExternalApiService = require("./services/external-api.service");
const DataRetentionService = require("./services/data-retention-service");

const basicAuth = require("express-basic-auth");

app.use(
  "/auth",
  basicAuth({
    users: { [process.env.MPA_AUTH_USERNAME]: process.env.MPA_AUTH_PASSWORD },
  }),
  authRoutes
);
app.use(
  "/notification",
  basicAuth({
    users: { [process.env.MPA_AUTH_USERNAME]: process.env.MPA_AUTH_PASSWORD },
  }),
  notificationRoutes
);
app.use(
  "/parking",
  basicAuth({
    users: { [process.env.MPA_AUTH_USERNAME]: process.env.MPA_AUTH_PASSWORD },
  }),
  parkingSpotRoutes
);
app.use(
  "/user",
  basicAuth({
    users: { [process.env.MPA_AUTH_USERNAME]: process.env.MPA_AUTH_PASSWORD },
  }),
  userRoutes
);

const externalApiService = new ExternalApiService();
const dataRetentionService = new DataRetentionService(db);

app.listen(process.env.PORT, function () {
  console.log(`Server running on port ${process.env.PORT}`);
});

cron.schedule("59 23 * * 6", async () => {
  try {
    await dataRetentionService.cleanUpParkingHistory();
    console.log("History of parking cleaned up successfully");
  } catch (error) {
    console.error(
      "Error while parking cleaning up parking history:",
      error.message
    );
  }
});

cron.schedule("*/1 * * * *", async () => {
  try {
    await externalApiService.updateParkingLotsWithNewData();
    console.log("Parking spots updated successfully.");
  } catch (error) {
    console.error("Error while updating parking spots:", error.message);
  }
});
