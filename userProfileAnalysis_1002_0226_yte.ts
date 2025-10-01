// 代码生成时间: 2025-10-02 02:26:26
import express from 'express';
import { Request, Response } from 'express';

// Define a User model
interface User {
    id: number;
    name: string;
    age: number;
    gender: string;
    interests: string[];
}

// Define a UserProfile service
class UserProfileService {
    private users: User[];
    constructor() {
        this.users = [];
    }

    // Add a new user to the system
    addUser(user: User): void {
        this.users.push(user);
    }

    // Get a user by ID
    getUserById(userId: number): User | undefined {
        return this.users.find(u => u.id === userId);
    }

    // Analyze user interests
    analyzeInterests(userId: number): string[] | null {
        const user = this.getUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user.interests;
    }
}

// Initialize the Express app
const app = express();

// JSON parser middleware
app.use(express.json());

// Create an instance of the UserProfile service
const userProfileService = new UserProfileService();

// Endpoint to add a new user
app.post('/users', (req: Request, res: Response) => {
    try {
        const newUser: User = req.body;
        userProfileService.addUser(newUser);
        res.status(201).send('User added successfully');
    } catch (error) {
        res.status(500).send('Error adding user');
    }
});

// Endpoint to get user interests
app.get('/users/:userId/interests', (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const interests = userProfileService.analyzeInterests(Number(userId));
        if (interests) {
            res.send(interests);
        } else {
            res.status(404).send('User interests not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});