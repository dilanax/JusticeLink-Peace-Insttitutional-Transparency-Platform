import Politician from "../Model/Politician.js";


// ==============================
// GET ALL POLITICIANS (Public)
// ==============================
export const getPoliticians = async (req, res) => {
  try {
    const { name, party, district } = req.query;

    let query = {};

    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    if (party) {
      query.party = party;
    }

    if (district) {
      query.district = district;
    }

    const politicians = await Politician.find(query);

    res.status(200).json(politicians);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch politicians",
      error: error.message
    });
  }
};


// ==============================
// GET SINGLE POLITICIAN (Public)
// ==============================
export const getPoliticianById = async (req, res) => {
  try {
    const politician = await Politician.findById(req.params.id);

    if (!politician) {
      return res.status(404).json({
        message: "Politician not found"
      });
    }

    res.status(200).json(politician);

  } catch (error) {
    res.status(500).json({
      message: "Error retrieving politician",
      error: error.message
    });
  }
};


// ==============================
// CREATE POLITICIAN (Admin Only)
// ==============================
export const createPolitician = async (req, res) => {
  try {
    const { name, party, district } = req.body;

    if (!name || !party || !district) {
      return res.status(400).json({
        message: "Name, party and district are required"
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


// ==============================
// UPDATE POLITICIAN (Admin Only)
// ==============================
export const updatePolitician = async (req, res) => {
  try {
    const updatedPolitician = await Politician.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedPolitician) {
      return res.status(404).json({
        message: "Politician not found"
      });
    }

    res.status(200).json(updatedPolitician);

  } catch (error) {
    res.status(400).json({
      message: "Error updating politician",
      error: error.message
    });
  }
};


// ==============================
// DELETE POLITICIAN (Admin Only)
// ==============================
export const deletePolitician = async (req, res) => {
  try {
    const deletedPolitician = await Politician.findByIdAndDelete(req.params.id);

    if (!deletedPolitician) {
      return res.status(404).json({
        message: "Politician not found"
      });
    }

    res.status(200).json({
      message: "Politician deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Error deleting politician",
      error: error.message
    });
  }
};