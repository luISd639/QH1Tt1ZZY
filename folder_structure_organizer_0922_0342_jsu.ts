// 代码生成时间: 2025-09-22 03:42:48
import express from 'express';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

// Promisify fs functions for easier use with async/await
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Define the Express app
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

/**
 * Organize folder structure
 * @param {string} directoryPath - The path to the directory to organize
 * @returns {Promise<void>} - A promise that resolves when the directory is organized
 */
async function organizeDirectory(directoryPath: string): Promise<void> {
  try {
    // Read the contents of the directory
    const files = await readdir(directoryPath);

    // Group files by type
    const groupedFiles = files.reduce((acc, file) => {
      const ext = path.extname(file);
      acc[ext] = (acc[ext] || []).concat(file);
      return acc;
    }, {} as Record<string, string[]>);

    // Create a new directory structure based on file types
    for (const [ext, files] of Object.entries(groupedFiles)) {
      const dirPath = path.join(directoryPath, ext.substring(1));
      fs.mkdirSync(dirPath, { recursive: true });
      files.forEach(file => {
        fs.renameSync(
          path.join(directoryPath, file),
          path.join(dirPath, file)
        );
      });
    }
  } catch (error) {
    console.error('Error organizing directory:', error);
    throw error;
  }
}

/**
 * Endpoint to trigger folder structure organization
 * @param {string} directoryPath - The path to the directory to organize
 */
app.post('/organize', async (req, res) => {
  const { directoryPath } = req.body;
  try {
    await organizeDirectory(directoryPath);
    res.status(200).json({ message: 'Folder organized successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error organizing folder', message: error.message });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Folder Structure Organizer is running on port ${port}`);
});