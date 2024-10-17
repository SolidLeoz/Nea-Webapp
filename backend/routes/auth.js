const express = require('express');
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Middleware per verificare il token JWT
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Token mancante' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token non valido' });
  }
};

// Configurazione di Passport per Google OAuth
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`
  },
  async function(accessToken, refreshToken, profile, cb) {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = new User({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          role: 'user' // Imposta il ruolo predefinito come 'user'
        });
        await user.save();
      }
      return cb(null, user);
    } catch (error) {
      return cb(error, null);
    }
  }));
} else {
  console.warn('Credenziali Google mancanti. L\'autenticazione Google non sarà disponibile.');
}

// Rotta per il login locale
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Credenziali non valide' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Errore durante il login', error: error.message });
  }
});

// Rotta per la registrazione locale
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    
    if (user) {
      return res.status(400).json({ message: 'Utente già registrato' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'user'
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Errore durante la registrazione', error: error.message });
  }
});

// Rotta per iniziare l'autenticazione Google
router.get('/google',
  (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return res.status(500).json({ error: 'Autenticazione Google non configurata' });
    }
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
  });

// Callback per l'autenticazione Google
router.get('/google/callback', 
  (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return res.status(500).json({ error: 'Autenticazione Google non configurata' });
    }
    passport.authenticate('google', { failureRedirect: '/login' })(req, res, next);
  },
  function(req, res) {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`);
  });

// Endpoint per verificare il ruolo admin
router.get('/verify-admin', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    const isAdmin = user.role === 'admin';
    res.json({ isAdmin });
  } catch (error) {
    res.status(500).json({ message: 'Errore durante la verifica del ruolo admin' });
  }
});

// Nuovo endpoint di debug per verificare il ruolo dell'utente
router.get('/debug-user-role', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    res.json({ userId: user._id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Errore durante il recupero delle informazioni dell\'utente', error: error.message });
  }
});

module.exports = router;
