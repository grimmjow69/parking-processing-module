const ReportService = require("../services/report-service");

const db = require("../db-connection");

const reportService = new ReportService(db);

exports.saveReport = async (req, res) => {
  try {
    const { userId, reportMessage, category } = req.body;

    await reportService.saveReport(userId, reportMessage, category);
    console.log("Report saved succesfully");
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(
      `Error saving report for user with ID ${userId} in category ${category}: ${error.message}`
    );
    res.status(500);
  }
};
