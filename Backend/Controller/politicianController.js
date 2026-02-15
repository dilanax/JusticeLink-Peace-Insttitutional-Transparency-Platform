const Politician = require('../Model/Politician'); // Importing your Mongoose model

class PoliticianController {
  
  // GET /api/politicians (with pagination)
  // Satisfies Requirement 40 (Filters, Pagination)
  async getAll(req, res) {
    try {
      const { limit = 50, offset = 0 } = req.query;

      // Mongoose logic: find all, skip (offset), and limit
      const data = await Politician.find()
        .limit(parseInt(limit))
        .skip(parseInt(offset))
        .sort({ name: 1 }); // Optional: Alphabetical sort

      const count = await Politician.countDocuments();

      res.json({
        success: true,
        data,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: count,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // POST /api/politicians
  // Satisfies Requirement 19 (CRUD - Create)
  async create(req, res) {
    try {
      // req.body contains the data from the frontend form
      const politician = await Politician.create(req.body);

      res.status(201).json({
        success: true,
        data: politician,
      });
    } catch (error) {
      res.status(400).json({ // 400 for validation errors
        success: false,
        error: error.message,
      });
    }
  }

  // GET /api/politicians/:id
  // Satisfies Requirement 39 & 40 (Entity management)
  async getById(req, res) {
    try {
      const { id } = req.params;

      // Using .populate() to get associated promises (Requirement 63)
      const politician = await Politician.findById(id).populate('promises');

      if (!politician) {
        return res.status(404).json({
          success: false,
          error: 'Politician not found',
        });
      }

      res.json({
        success: true,
        data: politician,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

// Export an instance of the class
module.exports = new PoliticianController();
exports.getPromiseNews = async (req, res) => {
    try {
        const response = await axios.get(`https://newsapi.org/v2/everything?q=${req.query.category}&apiKey=YOUR_KEY`);
        res.json(response.data.articles.slice(0, 5));
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch third-party news" });
    }
};