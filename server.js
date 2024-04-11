const dotenv = require("dotenv");
const express = require("express");
const cron = require("node-cron");
const basicAuth = require("express-basic-auth");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const db = require("./db-connection");
const authRoutes = require("./routes/auth-routes");
const notificationRoutes = require("./routes/notification-routes");
const parkingSpotRoutes = require("./routes/parking-spot-routes");
const userRoutes = require("./routes/user-routes");
const reportRoutes = require("./routes/report-routes");
const ExternalApiService = require("./services/external-api-service");
const DataRetentionService = require("./services/data-retention-service");

dotenv.config();
const app = express();
app.use(express.json());

const externalApiService = new ExternalApiService(db);
const dataRetentionService = new DataRetentionService(db);

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "PPM API",
      version: "1.0.0",
      description: "Parking-processing-module API documentation",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpecs = swaggerJSDoc(swaggerOptions);

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
  "/report",
  basicAuth({
    users: { [process.env.MPA_AUTH_USERNAME]: process.env.MPA_AUTH_PASSWORD },
  }),
  reportRoutes
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

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.listen(process.env.PORT, function () {
  console.log(`Server running on port ${process.env.PORT}`);
});

cron.schedule("59 23 * * 6", async () => {
  try {
    await dataRetentionService.cleanUpParkingHistory();
    console.log("History of parking cleaned up successfully");
  } catch (error) {
    console.error(
      `Error while parking cleaning up parking history: ${error.message}`
    );
  }
});

cron.schedule("*/2 * * * *", async () => {
  try {
    await externalApiService.updateParkingLotsWithNewData();
    console.log("Parking spots updated successfully");
  } catch (error) {
    console.error(`Error while updating parking spots: ${error.message}`);
  }
});
