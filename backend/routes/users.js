const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Middleware per verificare il token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Rotta per ottenere tutti gli utenti (protetta)
router.get('/', authenticateToken, (req, res) => {
  // Qui dovresti implementare la logica per recuperare gli utenti dal database
  // Per ora, restituiamo dati di esempio
  const users = [
    { id: 1, name: 'Mario Rossi', email: 'mario@example.com' },
    { id: 2, name: 'Luigi Verdi', email: 'luigi@example.com' },
  ];
  res.json(users);
});

module.exports = router;
