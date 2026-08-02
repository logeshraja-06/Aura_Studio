import ContactMessage from '../models/ContactMessage.js';

export const createContactMessage = async (req, res, next) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and message are required',
            });
        }

        const contactMessage = await ContactMessage.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: contactMessage,
        });
    } catch (error) {
        next(error);
    }
};