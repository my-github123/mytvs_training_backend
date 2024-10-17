const express = require('express');
const multer = require('multer');
const PdfTextController = require('../controller/PdfTextController');

// Initialize router
const router = express.Router();

// // Setup multer for file uploads


const upload = multer({
  storage: multer.memoryStorage(), // Store the file in memory
  fileFilter: (req, file, cb) => {
    // Accept only PDFs
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDFs are allowed'), false);
    }
  },
});





// Use the 'upload.single' method if uploading one PDF file at a time
router.post('/upload', upload.single('pdfFile'),PdfTextController.uploadPdf);

// Route to get extracted text by ID
router.get('/upload/:id', PdfTextController.getTextById);



module.exports = router;
