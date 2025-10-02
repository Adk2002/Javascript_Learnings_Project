import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Import routes
import userRoutes from "./routes/multer.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

// Configure environment variables
dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();

// ============================================
// MIDDLEWARE CONFIGURATION
// ============================================

// CORS configuration
// app.use(cors({
//     origin: process.env.CORS_ORIGIN || "http://localhost:5173",
//     credentials: true
// }));

// Body parsers
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Cookie parser
// app.use(cookieParser());

// Serve static files (uploaded files)
app.use('/uploads', express.static(path.join(__dirname, 'upload')));

// ============================================
// CREATE UPLOAD DIRECTORIES IF NOT EXISTS
// ============================================

const uploadDirs = [
    path.join(__dirname, 'upload'),
    path.join(__dirname, 'upload', 'profilePic'),
    path.join(__dirname, 'upload', 'Images')
];

uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
    }
});

// ============================================
// ROUTES
// ============================================

// Root route - Welcome message
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to File Upload API",
        version: "1.0.0",
        endpoints: {
            health: "/health",
            uploadProfile: "/api/v1/users/upload-profile",
            uploadGallery: "/api/v1/users/upload-gallery",
            completeProfile: "/api/v1/users/complete-profile"
        }
    });
});

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running smoothly",
        timestamp: new Date().toISOString()
    });
});

// API routes
app.use('/api/v1/users', userRoutes);

// ============================================
// 404 HANDLER - Must be after all routes
// ============================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
        availableRoutes: [
            "GET /",
            "GET /health",
            "POST /api/v1/users/upload-profile",
            "POST /api/v1/users/upload-gallery",
            "POST /api/v1/users/complete-profile"
        ]
    });
});

// ============================================
// ERROR HANDLING MIDDLEWARE (Must be last)
// ============================================

app.use(errorHandler);

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`⚡ Server is running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📂 Upload directories ready`);
    console.log(`🔗 Root URL: http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('❌ UNHANDLED REJECTION! Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});

export default app;