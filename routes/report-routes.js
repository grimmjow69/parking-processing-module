const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report-controller");

router.post("/save-report", reportController.saveReport);

module.exports = router;
