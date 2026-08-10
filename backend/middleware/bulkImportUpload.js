const multer = require("multer");

// Keep bulk import file in memory.
// XLSX package will directly read the uploaded buffer.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedExtensions = [".xlsx", ".xls", ".csv"];

  const fileName = file.originalname.toLowerCase();

  const isAllowed = allowedExtensions.some((extension) =>
    fileName.endsWith(extension)
  );

  if (isAllowed) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only Excel (.xlsx, .xls) or CSV files are allowed"
      )
    );
  }
};

const bulkImportUpload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },

  fileFilter,
});

module.exports = bulkImportUpload;