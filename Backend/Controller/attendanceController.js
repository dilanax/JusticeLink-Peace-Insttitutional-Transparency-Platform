import mongoose from "mongoose";
import Attendance from "../Model/Attendance.js";
import Session from "../Model/Session.js";
import Politician from "../Model/Politician.js";


// ==============================
// GET Attendance By Politician
// ==============================
export const getAttendanceByPolitician = async (req, res) => {
  try {
    const { politicianId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(politicianId)) {
      return res.status(400).json({ message: "Invalid politician ID" });
    }

    const politician = await Politician.findById(politicianId);
    if (!politician) {
      return res.status(404).json({ message: "Politician not found" });
    }

    const records = await Attendance.find({ politicianId })
      .populate("sessionId", "date topic");

    if (!records.length) {
      return res.status(404).json({ message: "No attendance records found" });
    }

    const total = records.length;
    const present = records.filter(r => r.status === "Present").length;
    const percentage = ((present / total) * 100).toFixed(2);

    res.json({
      politician: politician.name,
      attendancePercentage: percentage,
      totalSessions: total,
      presentSessions: present,
      records
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ==============================
// GET All Sessions
// ==============================
export const getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find().sort({ date: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ==============================
// RECORD Attendance
// ==============================
export const recordAttendance = async (req, res) => {
  try {
    const { politicianId, sessionId, status } = req.body;

    // Required fields
    if (!politicianId || !sessionId || !status) {
      return res.status(400).json({
        message: "politicianId, sessionId and status are required"
      });
    }

    // Validate ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(politicianId) ||
      !mongoose.Types.ObjectId.isValid(sessionId)
    ) {
      return res.status(400).json({
        message: "Invalid politicianId or sessionId"
      });
    }

    // Validate status
    const allowedStatus = ["Present", "Absent", "Excused"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value"
      });
    }

    // Check politician exists
    const politician = await Politician.findById(politicianId);
    if (!politician) {
      return res.status(404).json({ message: "Politician not found" });
    }

    // Check session exists
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const attendance = await Attendance.create({
      politicianId,
      sessionId,
      status
    });

    res.status(201).json(attendance);

  } catch (error) {

    // Handle duplicate entry (unique index)
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Attendance already recorded for this session"
      });
    }

    res.status(500).json({ message: error.message });
  }
};


// ==============================
// Compare Attendance
// ==============================
export const compareAttendance = async (req, res) => {
  try {
    const { ids } = req.query;

    if (!ids) {
      return res.status(400).json({ message: "ids query parameter required" });
    }

    const idArray = ids.split(",");

    const results = [];

    for (let id of idArray) {

      if (!mongoose.Types.ObjectId.isValid(id)) continue;

      const records = await Attendance.find({ politicianId: id });

      const total = records.length;
      const present = records.filter(r => r.status === "Present").length;
      const percentage = total ? ((present / total) * 100).toFixed(2) : 0;

      const politician = await Politician.findById(id);

      if (!politician) continue;

      results.push({
        politician: politician.name,
        totalSessions: total,
        presentSessions: present,
        attendancePercentage: percentage
      });
    }

    res.json(results);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ==============================
// Update Attendance
// ==============================
export const updateAttendance = async (req, res) => {
  try {
    const { recordId } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(recordId)) {
      return res.status(400).json({ message: "Invalid record ID" });
    }

    const allowedStatus = ["Present", "Absent", "Excused"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value"
      });
    }

    const updated = await Attendance.findByIdAndUpdate(
      recordId,
      { status },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json(updated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};