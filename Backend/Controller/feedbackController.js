import Feedback from "../Model/Feedback.js";

export const createFeedback = async (req, res) => {
  try {
    const { comment, evidenceUrl } = req.body;

    const feedback = await Feedback.create({
      promiseId: req.params.promiseId,
      userId: req.user.id,
      comment,
      evidenceUrl,
    });

    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getFeedbackByPromise = async (req, res) => {
  try {
    const feedback = await Feedback.find({
      promiseId: req.params.promiseId,
    }).populate("userId", "name");

    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const voteFeedback = async (req, res) => {
  try {
    const { type } = req.body; // up or down

    const feedback = await Feedback.findById(req.params.promiseId);

    if (!feedback) return res.status(404).json({ message: "Not found" });

    if (type === "up") feedback.upvotes++;
    if (type === "down") feedback.downvotes++;

    await feedback.save();

    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) return res.status(404).json({ message: "Not found" });

    if (feedback.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    feedback.comment = req.body.comment || feedback.comment;
    feedback.evidenceUrl = req.body.evidenceUrl || feedback.evidenceUrl;

    await feedback.save();

    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) return res.status(404).json({ message: "Not found" });

    if (feedback.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    await feedback.deleteOne();

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};