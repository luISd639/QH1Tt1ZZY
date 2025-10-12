// 代码生成时间: 2025-10-13 02:20:19
import express, { Request, Response } from 'express';
import { NotificationService } from './notification_service'; // Assuming a separate file for notification logic

// Create an Express application
const app = express();

// Define port for the server
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Define a route to send notifications
app.post('/send-notification', async (req: Request, res: Response) => {
    try {
        // Validate request body
        if (!req.body.message) {
            return res.status(400).json({
                error: 'Message is required'
            });
        }

        // Instantiate the NotificationService and send the notification
        const notificationService = new NotificationService();
        await notificationService.sendNotification(req.body.message);

        // Send a success response
        res.status(200).json({
            message: 'Notification sent successfully'
        });
    } catch (error) {
        // Handle any errors that occur during the process
        console.error('Failed to send notification:', error);
        res.status(500).json({
            error: 'An error occurred while sending notification'
        });
    }
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Notification system listening on port ${PORT}`);
});
