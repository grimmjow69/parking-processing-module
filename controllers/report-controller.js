const ReportService = require("../services/report-service");

const reportService = new ReportService();

exports.saveReport = async (req, res) => {
  try {
    const { userId, reportMessage, category } = req.body;

    await reportService.saveReport(userId, reportMessage, category);
    console.log("Report saved succesfully");
    res.status(200).json({ operation: "save-report", success: true });
  } catch (error) {
    console.error(
      `Error saving report for user with ID ${userId} in category ${category}: ${error.message}`
    );
    res.status(500).json({
      operation: "save-report",
      error: error.message,
      success: false,
    });
  }
};
