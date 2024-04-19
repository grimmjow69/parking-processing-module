const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();

const { pool, initializeDatabase } = require("./db-connection");

const cron = require("node-cron");

const authRoutes = require("./routes/auth-routes");
const notificationRoutes = require("./routes/notification-routes");
const parkingSpotRoutes = require("./routes/parking-spot-routes");
const userRoutes = require("./routes/user-routes");
const reportRoutes = require("./routes/report-routes");
const settingsRoutes = require("./routes/settings-routes");

const ExternalApiService = require("./services/external-api-service");
const DataRetentionService = require("./services/data-retention-service");

const basicAuth = require("express-basic-auth");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

initializeDatabase()
  .then(() => {
    console.log("Database setup completed");
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
  });

// Middleware
app.use(express.json());

// Swagger options
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

// Routes
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

app.use(
  "/settings",
  basicAuth({
    users: {
      [process.env.APPLICATION_USERNAME]: process.env.APPLICATION_PASSWORD,
    },
  }),
  settingsRoutes
);

// Initialize services
const externalApiService = new ExternalApiService();
const dataRetentionService = new DataRetentionService();

// Serve Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Start server
app.listen(process.env.PORT, function () {
  console.log(`Server running on port ${process.env.PORT}`);
});

// At 23:59 on Saturday.
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

// At every 1st minute past every hour from 6 through 18 on every day-of-week from Monday through Friday.
cron.schedule("*/2 6-18 * * 1-5", async () => {
  try {
    await externalApiService.updateParkingSpotsWithNewData();
    console.log("Parking spots updated successfully");
  } catch (error) {
    console.error(`Error while updating parking spots: ${error.message}`);
  }
});

// At every 15th minute past every hour from 18 through 21 on every day-of-week from Monday through Friday.
cron.schedule("*/15 18-21 * * 1-5", async () => {
  try {
    await externalApiService.updateParkingSpotsWithNewData();
    console.log("Parking spots updated successfully");
  } catch (error) {
    console.error(`Error while updating parking spots: ${error.message}`);
  }
});

// At every 30th minute past every hour from 8 through 20 on Saturday and Sunday.
cron.schedule("*/30 8-20 * * 6,7", async () => {
  try {
    await externalApiService.updateParkingSpotsWithNewData();
    console.log("Parking spots updated successfully");
  } catch (error) {
    console.error(`Error while updating parking spots: ${error.message}`);
  }
});
