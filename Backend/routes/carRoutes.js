const express = require('express');
const db = require('../config/db');
const { verifyToken, requireRole } = require('../middleware/auth');
const router = express.Router();

// Get all available cars (public)
router.get('/', async (req, res) => {
    try {
        const [cars] = await db.execute(`
            SELECT cars.*, users.name as agencyName 
            FROM cars 
            JOIN users ON cars.agency_id = users.id
            ORDER BY cars.created_at DESC
        `);
        res.json(cars);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get cars by agency (protected)
router.get('/my-cars', verifyToken, requireRole('agency'), async (req, res) => {
    try {
        const [cars] = await db.execute('SELECT * FROM cars WHERE agency_id = ? ORDER BY created_at DESC', [req.user.id]);
        res.json(cars);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add new car (agency only)
router.post('/add', verifyToken, requireRole('agency'), async (req, res) => {
    const { model, number, capacity, rent, image } = req.body;
    if (!model || !number || !capacity || !rent) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    try {
        const [existing] = await db.execute('SELECT id FROM cars WHERE number = ?', [number]);
        if (existing.length > 0) return res.status(400).json({ message: 'Vehicle number already registered.' });

        await db.execute(
            'INSERT INTO cars (agency_id, model, number, capacity, rent, image) VALUES (?, ?, ?, ?, ?, ?)',
            [req.user.id, model, number, capacity, rent, image || null]
        );
        res.status(201).json({ success: true, message: 'Car added successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Edit car (agency only, must own the car)
router.put('/edit/:id', verifyToken, requireRole('agency'), async (req, res) => {
    const { model, number, capacity, rent, image } = req.body;
    try {
        const [cars] = await db.execute('SELECT * FROM cars WHERE id = ? AND agency_id = ?', [req.params.id, req.user.id]);
        if (cars.length === 0) return res.status(403).json({ message: 'Car not found or access denied.' });

        await db.execute(
            'UPDATE cars SET model=?, number=?, capacity=?, rent=?, image=? WHERE id=?',
            [model, number, capacity, rent, image || null, req.params.id]
        );
        res.json({ success: true, message: 'Car updated successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete car (agency only, must own the car)
router.delete('/delete/:id', verifyToken, requireRole('agency'), async (req, res) => {
    try {
        const [cars] = await db.execute('SELECT * FROM cars WHERE id = ? AND agency_id = ?', [req.params.id, req.user.id]);
        if (cars.length === 0) return res.status(403).json({ message: 'Car not found or access denied.' });

        await db.execute('DELETE FROM cars WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Car deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
