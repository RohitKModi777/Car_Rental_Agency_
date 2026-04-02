const express = require('express');
const db = require('../config/db');
const { verifyToken, requireRole } = require('../middleware/auth');
const router = express.Router();

// Rent a car (customer only)
router.post('/rent', verifyToken, requireRole('customer'), async (req, res) => {
    const { car_id, start_date, days, total_rent } = req.body;
    if (!car_id || !start_date || !days) {
        return res.status(400).json({ message: 'All booking fields are required.' });
    }
    try {
        // Check car exists
        const [cars] = await db.execute('SELECT * FROM cars WHERE id = ?', [car_id]);
        if (cars.length === 0) return res.status(404).json({ message: 'Car not found.' });

        await db.execute(
            'INSERT INTO bookings (car_id, customer_id, start_date, days, total_rent) VALUES (?, ?, ?, ?, ?)',
            [car_id, req.user.id, start_date, days, total_rent]
        );
        res.status(201).json({ success: true, message: 'Car booked successfully!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get agency bookings (agency only)
router.get('/agency', verifyToken, requireRole('agency'), async (req, res) => {
    try {
        const [bookings] = await db.execute(`
            SELECT b.*, u.name as customerName, u.email as customerEmail, 
                   c.model as carModel, c.number as carNumber
            FROM bookings b
            JOIN users u ON b.customer_id = u.id
            JOIN cars c ON b.car_id = c.id
            WHERE c.agency_id = ?
            ORDER BY b.created_at DESC
        `, [req.user.id]);
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get customer bookings (customer only)
router.get('/my-bookings', verifyToken, requireRole('customer'), async (req, res) => {
    try {
        const [bookings] = await db.execute(`
            SELECT b.*, c.model as carModel, c.number as carNumber, 
                   c.image as carImage, u.name as agencyName
            FROM bookings b
            JOIN cars c ON b.car_id = c.id
            JOIN users u ON c.agency_id = u.id
            WHERE b.customer_id = ?
            ORDER BY b.created_at DESC
        `, [req.user.id]);
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
