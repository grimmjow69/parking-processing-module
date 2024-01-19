const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();

app.use(express.json());

const authRoutes = require("./routes/auth-routes");
const notificationRoutes = require("./routes/notification-routes");
const parkingSpotRoutes = require("./routes/parking-spot-routes");
const userRoutes = require("./routes/user-routes");
const ratingRoutes = require("./routes/rating-routes");

app.use("/auth", authRoutes);
app.use("/notification", notificationRoutes);
app.use("/parking", parkingSpotRoutes);
app.use("/user", userRoutes);
app.use("/rating", ratingRoutes);

app.listen(process.env.PORT, function () {
  console.log(`Server running on port ${process.env.PORT}`);
});
