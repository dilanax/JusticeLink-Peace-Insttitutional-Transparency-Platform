const Attendance = require("../models/Attendance");
const Session = require("../models/Session");

// 🔹 Get attendance by politician ID
exports.getAttendanceByPolitician = async (req, res) => {
  try {
    const { politicianId } = req.params;

    // Total sessions
    const totalSessions = await Session.countDocuments();

    // Present count
    const presentCount = await Attendance.countDocuments({
      politicianId,
      status: "Present"
    });

    const percentage = totalSessions === 0
      ? 0
      : ((presentCount / totalSessions) * 100).toFixed(2);

    // Full records with session details
    const records = await Attendance.find({ politicianId })
      .populate("sessionId");

    res.status(200).json({
      attendancePercentage: percentage,
      totalSessions,
      presentCount,
      records
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Record attendance (Admin only)
exports.recordAttendance = async (req, res) => {
  try {
    const { politicianId, sessionId, status } = req.body;

    const newRecord = new Attendance({
      politicianId,
      sessionId,
      status
    });

    await newRecord.save();

    res.status(201).json({
      message: "Attendance recorded successfully",
      newRecord
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};