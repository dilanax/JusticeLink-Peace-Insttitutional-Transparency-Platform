import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./Routes/userRoutes.js";
import promiseRoutes from "./Routes/promiseRoutes.js";
import politicianRoutes from "./Routes/politicianRoutes.js";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

// 1. Load environment variables first
dotenv.config();

// 2. Define the PORT before using it anywhere else!
const PORT = process.env.PORT || 5000;

// 3. Initialize Express
const app = express();
app.use(express.json());

// 4. Set up Swagger Documentation
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Janaya360 Backend API",
    version: "1.0.0",
    description: "API documentation for the political tracking platform",
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
        bearerFormat: "JWT"
      }
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
          role: { type: "string" }
        },
        required: ["name", "email", "password", "phone"]
      },
      LoginUser: {
        type: "object",
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string" }
        },
        required: ["email", "password"]
      },
      PromiseCreate: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          dueDate: { type: "string", format: "date" }
        },
        required: ["title"]
      }
    }
  }
};

const options = {
  swaggerDefinition,
  apis: ["./Routes/*.js"], // Scans your routes for JSDoc comments
};

const swaggerSpec = swaggerJsdoc(options);

// 5. Connect to MongoDB and start the server
mongoose
  .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000, family: 4 })
  .then(() => {
    console.log("MongoDB Connected Successfully!");

    // Register routes after DB connection
    app.use("/api/users", userRoutes);
    app.use("/api/promises", promiseRoutes);
    app.use("/api/politicians", politicianRoutes);
    
    // Register Swagger UI
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message || err);
    console.error(err);
    process.exit(1);
  });