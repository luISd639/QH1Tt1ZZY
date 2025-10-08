// 代码生成时间: 2025-10-08 19:49:44
import express from 'express';
import { createConnection } from 'typeorm';

// Define an Entity for the Database
import { User } from './entities/User';

// Define the database connection options
const dbOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'your_username',
  password: 'your_password',
  database: 'your_database',
  entities: [User],
  synchronize: true, // Be careful with this in production
};

// Initialize the database connection
async function connectToDatabase() {
  try {
    await createConnection(dbOptions);
    console.log('Database connection successful.');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

// Define the Express application
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Route to create a new user
app.post('/users', async (req, res) => {
  try {
    // Extract user data from the request body
    const userData = req.body;
    // Create a new user instance and save to the database
    const newUser = await User.create(userData).save();
    res.status(201).send(newUser);
  } catch (error) {
    // Handle any errors that occur during user creation
    res.status(500).send({ error: 'Failed to create user' });
  }
});

// Route to get all users
app.get('/users', async (req, res) => {
  try {
    // Find all users in the database
    const users = await User.find();
    res.send(users);
  } catch (error) {
    // Handle any errors that occur during user retrieval
    res.status(500).send({ error: 'Failed to retrieve users' });
  }
});

// Start the Express server
async function startServer() {
  await connectToDatabase();
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

// Call the function to start the server
startServer();