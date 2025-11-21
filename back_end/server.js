require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

// CORS configuration for multiple environments
const derivedRailwayDomain = process.env.RAILWAY_PUBLIC_DOMAIN
  ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
  : null;

const normalizeOrigin = (origin) =>
  typeof origin === 'string' ? origin.replace(/\/$/, '') : origin;

const additionalOrigins = process.env.CORS_ADDITIONAL_ORIGINS
  ? process.env.CORS_ADDITIONAL_ORIGINS.split(',')
      .map(origin => origin.trim())
      .filter(Boolean)
  : [];

const allowedOrigins = [
  'http://localhost:3000',
  'https://localhost:3000',
  'https://movie-site-mu-five.vercel.app',
  process.env.FRONTEND_URL,
  derivedRailwayDomain,
  ...additionalOrigins
]
  .filter(Boolean)
  .map(normalizeOrigin);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const normalizedOrigin = normalizeOrigin(origin);

    if (allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked for origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Middleware
app.use(express.json());

// MongoDB Connection
if (!process.env.MONGO_URL) {
  console.error("Missing MONGO_URL environment variable. Set it before starting the server.");
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// API Routes
app.use("/auth", require("./routes/auth"));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: 'OK',
    message: 'Movie Review API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder if the frontend build is present
  const frontendPath = path.join(__dirname, '../front_end/dist');

  if (fs.existsSync(frontendPath)) {
    app.use(express.static(frontendPath));

    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(frontendPath, 'index.html'));
    });
  } else {
    console.log('No frontend build found at', frontendPath, '- skipping static file hosting.');
  }
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});