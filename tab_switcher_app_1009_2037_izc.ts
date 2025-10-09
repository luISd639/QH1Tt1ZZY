// 代码生成时间: 2025-10-09 20:37:48
import express, { Request, Response, NextFunction } from 'express';
import { urlencoded, json } from 'body-parser';

// Define the Express application
const app = express();

// Middleware to parse request bodies
app.use(urlencoded({ extended: true }));
app.use(json());

// Define the port number
const PORT = process.env.PORT || 3000;

// Define the tab states
interface TabState {
  [key: string]: boolean;
}

// Define the tabs available
const tabs: TabState = {
  'tab1': true,
  'tab2': false,
  'tab3': false
};

// Route to handle tab switching
app.post('/api/switch-tab', (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if the requested tab is valid
    if (!tabs.hasOwnProperty(req.body.tab)) {
      return res.status(400).json({
        error: 'Invalid tab requested'
      });
    }

    // Update the tab state
    tabs[req.body.tab] = true;
    // Disable other tabs
    for (const tab in tabs) {
      if (tab !== req.body.tab) {
        tabs[tab] = false;
      }
    }

    // Send the updated tab states
    res.status(200).json({
      tabs: tabs
    });
  } catch (error) {
    next(error);
  }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
