import Politician from "../Model/Politician.js";

/* ================= CREATE ================= */
// Admin Only
export const createPolitician = async (req, res) => {
  try {

    const politician = await Politician.create({
      ...req.body,
      createdBy: req.user._id
    });

    res.status(201).json({
      message: "Politician created successfully",
      politician
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= READ ALL ================= */
export const getAllPoliticians = async (req, res) => {
  try {
    const politicians = await Politician.find();
    res.json(politicians);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= READ ONE ================= */
export const getPoliticianById = async (req, res) => {
  try {
    const politician = await Politician.findById(req.params.id);

    if (!politician) {
      return res.status(404).json({ message: "Politician not found" });
    }

    res.json(politician);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= UPDATE ================= */
// Admin Only
export const updatePolitician = async (req, res) => {
  try {

    const politician = await Politician.findById(req.params.id);

    if (!politician) {
      return res.status(404).json({ message: "Politician not found" });
    }

    politician.name = req.body.name || politician.name;
    politician.party = req.body.party || politician.party;
    politician.district = req.body.district || politician.district;
    politician.position = req.body.position || politician.position;
    politician.bio = req.body.bio || politician.bio;
    politician.profileImageUrl = req.body.profileImageUrl || politician.profileImageUrl;

    const updated = await politician.save();

    res.json({
      message: "Politician updated successfully",
      politician: updated
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= DELETE ================= */
// Admin Only
export const deletePolitician = async (req, res) => {
  try {

    const politician = await Politician.findById(req.params.id);

    if (!politician) {
      return res.status(404).json({ message: "Politician not found" });
    }

    await politician.deleteOne();

    res.json({ message: "Politician deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};