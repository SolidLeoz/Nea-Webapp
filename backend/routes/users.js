const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, isAdmin } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/users
 * @desc    Ottiene lista utenti con paginazione e filtri
 * @access  Admin
 */
router.get('/', protect, isAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Costruzione query di filtro
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Esegue query con filtri e paginazione
    const users = await User.find(filter)
      .select('-password') // Esclude il campo password
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Conta totale documenti per paginazione
    const total = await User.countDocuments(filter);

    res.json({
      users,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total
    });
  } catch (error) {
    console.error('Errore nel recupero degli utenti:', error);
    res.status(500).json({ message: 'Errore nel recupero degli utenti' });
  }
});

/**
 * @route   GET /api/users/:id
 * @desc    Ottiene un singolo utente per ID
 * @access  Admin
 */
router.get('/:id', protect, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    res.json(user);
  } catch (error) {
    console.error('Errore nel recupero dell\'utente:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'ID utente non valido' });
    }
    res.status(500).json({ message: 'Errore nel recupero dell\'utente' });
  }
});

/**
 * @route   GET /api/users/stats/summary
 * @desc    Ottiene statistiche sugli utenti
 * @access  Admin
 */
router.get('/stats/summary', protect, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    res.json({
      totalUsers,
      totalAdmins,
      recentUsers,
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Errore nel recupero delle statistiche:', error);
    res.status(500).json({ message: 'Errore nel recupero delle statistiche' });
  }
});

module.exports = router;
