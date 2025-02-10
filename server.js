const express = require("express");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const { spawn } = require("child_process");
const pdf2pic = require("pdf2pic");

const app = express();
const port = 5000;

app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use("/thumbnails", express.static("thumbnails"));

// Ensure `uploads` and `thumbnails` directories exist
if (!fs.existsSync("./uploads")) fs.mkdirSync("./uploads");
if (!fs.existsSync("./thumbnails")) fs.mkdirSync("./thumbnails");

// Storage for uploaded books
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    let uploadPath = `./uploads/${file.originalname}`;

    if (fs.existsSync(uploadPath)) {
      const fileExt = path.extname(file.originalname);
      const fileName = path.basename(file.originalname, fileExt);
      const uniqueFileName = `${fileName}-${Date.now()}${fileExt}`;
      cb(null, uniqueFileName);
    } else {
      cb(null, file.originalname);
    }
  },
});

const upload = multer({ storage });

// Function to generate a thumbnail from a PDF
const generateThumbnail = async (pdfPath, thumbnailPath) => {
  try {
    const pdf2picConverter = new pdf2pic({
      density: 100,
      savePath: "./thumbnails",
      format: "png",
      width: 200,
      height: 250,
    });

    const result = await pdf2picConverter.convert(pdfPath, 1);
    if (result && result.length > 0) {
      fs.renameSync(result[0].path, thumbnailPath);
    }
  } catch (error) {
    console.error("Error generating thumbnail:", error);
  }
};

// Handle file upload and generate a thumbnail
app.post("/upload", upload.single("book"), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).send("No file uploaded");

  const thumbnailPath = `./thumbnails/${file.filename.replace(".pdf", ".png")}`;

  await generateThumbnail(`./uploads/${file.filename}`, thumbnailPath);

  res.json({ filename: file.filename, thumbnail: `/thumbnails/${path.basename(thumbnailPath)}` });
});

// Fetch available books
app.get("/books", (req, res) => {
  fs.readdir("./uploads/", (err, files) => {
    if (err) return res.status(500).json({ message: "Error fetching books" });

    const books = files
      .filter((file) => file.endsWith(".pdf"))
      .map((file) => ({
        filename: file,
        thumbnail: `/thumbnails/${file.replace(".pdf", ".png")}`,
      }));

    res.json({ books });
  });
});

// Start the server
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
