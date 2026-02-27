import Politician from '../Model/Politician.js';


// GET all politicians
export const getPoliticians = async (req, res) => {
  try {
    const { name, party, district } = req.query;
    let query = {};

    if (name) query.name = { $regex: name, $options: 'i' };
    if (party) query.party = party;
    if (district) query.district = district;

    const politicians = await Politician.find(query);
    res.status(200).json(politicians);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch politicians",
      error: error.message
    });
  }
};


// GET single politician
export const getPoliticianById = async (req, res) => {
  try {
    const politician = await Politician.findById(req.params.id);

    if (!politician) {
      return res.status(404).json({ message: "Politician not found" });
    }

    res.status(200).json(politician);

  } catch (error) {
    res.status(500).json({
      message: "Error retrieving politician",
      error: error.message
    });
  }
};


// CREATE politician (Admin protected via middleware)
export const createPolitician = async (req, res) => {
  try {
    const { name, party, district } = req.body;

    if (!name || !party || !district) {
      return res.status(400).json({
        message: "Name, party, and district are required"
      });
    }

    const newPolitician = await Politician.create({
      name,
      party,
      district
    });

    res.status(201).json(newPolitician);

  } catch (error) {
    res.status(400).json({
      message: "Invalid data",
      error: error.message
    });
  }
};


// UPDATE politician (Admin protected via middleware)
export const updatePolitician = async (req, res) => {
  try {
    const updatedPolitician = await Politician.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedPolitician) {
      return res.status(404).json({ message: "Politician not found" });
    }

    res.status(200).json(updatedPolitician);

  } catch (error) {
    res.status(400).json({
      message: "Error updating profile",
      error: error.message
    });
  }
};


// DELETE politician (Admin protected via middleware)
export const deletePolitician = async (req, res) => {
  try {
    const politician = await Politician.findByIdAndDelete(req.params.id);

    if (!politician) {
      return res.status(404).json({ message: "Politician not found" });
    }

    res.status(200).json({
      message: "Politician successfully removed"
    });

  } catch (error) {
    res.status(500).json({
      message: "Error deleting politician",
      error: error.message
    });
  }
};