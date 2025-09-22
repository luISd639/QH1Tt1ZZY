// 代码生成时间: 2025-09-23 00:42:34
// Import necessary modules
import express from 'express';
import multer from 'multer';
import { DocumentType, parseDocument } from 'docx';

// Initialize Express application
const app = express();
const port = 3000;

// Set storage engine for multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Endpoint to convert documents to JSON
app.post('/api/convert', upload.single('document'), async (req, res) => {
  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  try {
    // Parse the document
    const document = parseDocument(req.file.buffer);

    // Convert document to JSON
    const json = document.toJSON();

    // Send the JSON response
    res.json(json);
  } catch (error) {
    // Handle any parsing errors
    res.status(500).json({ error: 'Failed to parse document.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Document Converter running on http://localhost:${port}`);
});

// Middleware for parsing JSON request bodies
app.use(express.json());

// Middleware for serving static files (if needed)
app.use(express.static('public'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'An internal error occurred.' });
});

/**
 * Note: This code assumes the use of the 'docx' package for parsing DOCX files.
 * Ensure that the 'docx' and 'multer' packages are installed before running this application.
 * To install these packages, use npm or yarn:
 * npm install docx multer
 * yarn add docx multer
 * 
 * This code also assumes that the 'parseDocument' function from 'docx' package returns a document object
 * that has a 'toJSON' method. If the actual implementation differs, adjust the code accordingly.
 */
