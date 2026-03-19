const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Absolute uploads folder at project root (using __dirname ensures it works from anywhere)
const uploadsDir = path.resolve(__dirname, "../uploads");

console.log("📂 Uploads directory configuration:");
console.log("   __dirname:", __dirname);
console.log("   uploadsDir absolute:", uploadsDir);

// Ensure folder exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true, mode: 0o777 });
  console.log("✅ Created uploads directory");
} else {
  console.log("✅ Uploads directory already exists");
}

// Verify writeable
try {
  fs.accessSync(uploadsDir, fs.constants.W_OK);
  console.log("✅ Uploads folder is writable");
} catch (err) {
  console.error("❌ Uploads folder not writable:", err.message);
}

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir), // always absolute
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    const filename = `${name}-${timestamp}-${random}${ext}`;
    console.log(`📄 Generated filename: ${filename}`);
    cb(null, filename);
  },
});

// Accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files allowed"));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

module.exports = upload;