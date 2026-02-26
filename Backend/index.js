import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./Routes/userRoutes.js";
import newsRoutes from "./Routes/newsRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import newsRoutes from "./Routes/newsRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import feedbackRoutes from "./Routes/feedbackRoutes.js";
import promiseRoutes from "./Routes/promiseRoutes.js";
import politicianRoutes from "./Routes/politicianRoutes.js";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
 feature_citizen-feedback

import politicianRoutes from "./Routes/politicianRoutes.js";
import attendanceRoutes from "./Routes/attendanceRoutes.js";
import politicianRoutes from "./Routes/politicianRoutes.js";
import sessionRoutes from "./Routes/sessionRoutes.js";
 Develop

dotenv.config();

const app = express();
// CORS Configuration
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(cors());
app.use(express.json());

 feature_citizen-feedback
const PORT = process.env.PORT || 5000;

// Minimal Swagger setup
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Backend API",
    version: "1.0.0",
    description: "Minimal API docs",
  },
  servers: [
    {
      url: `http://localhost:${PORT}`,
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      RegisterUser: {
        type: "object",
        properties: {
          name: { type: "string" },
          email: { type: "string", format: "email" },
          password: { type: "string" },
          phone: { type: "string" },
          district: { type: "string" },
          role: { type: "string" },
        },
        required: ["name", "email", "password", "phone"],
      },
      LoginUser: {
        type: "object",
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string" },
        },
        required: ["email", "password"],
      },
      PromiseCreate: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          dueDate: { type: "string", format: "date" },
        },
        required: ["title"],
      },
    },
  },
};

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
 Develop

const options = {
  swaggerDefinition,
  apis: ["./Routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

 feature_citizen-feedback
// Connect to MongoDB then register routes and start server
mongoose
  .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000, family: 4 })
  .then(() => {
    console.log("MongoDB Connected");

    // Register all routes
    app.use("/api/users", userRoutes);
    app.use("/api/feedback", feedbackRoutes);
    app.use("/api/promises", promiseRoutes);
    app.use("/api/politicians", politicianRoutes);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Start server when DB is available
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message || err);
    console.error(err);
    process.exit(1);
  });


app.use("/api/users", userRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/attendance",attendanceRoutes);
app.use("/api/politicians", politicianRoutes);
app.use("/api/sessions", sessionRoutes);

app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));
 Develop
