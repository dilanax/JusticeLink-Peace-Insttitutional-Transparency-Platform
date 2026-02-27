import mongoose from "mongoose";
import Session from "../Model/Session.js";


// CREATE Session
export const createSession = async (req, res) => {
  try {
    const { date, topic } = req.body;

    if (!date || !topic) {
      return res.status(400).json({
        message: "Date and topic are required"
      });
    }

    if (isNaN(Date.parse(date))) {
      return res.status(400).json({
        message: "Invalid date format"
      });
    }

    const session = await Session.create({
      date,
      topic: topic.trim()
    });

    res.status(201).json(session);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET All Sessions
export const getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find().sort({ date: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET Single Session
export const getSessionById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid session ID" });
    }

    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json(session);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE Session
export const updateSession = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid session ID" });
    }

    const updated = await Session.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json(updated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// DELETE Session
export const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid session ID" });
    }

    const deleted = await Session.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json({ message: "Session deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};