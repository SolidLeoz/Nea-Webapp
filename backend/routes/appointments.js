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

// Rotta per ottenere tutti gli appuntamenti (protetta)
router.get('/', authenticateToken, (req, res) => {
  // Qui dovresti implementare la logica per recuperare gli appuntamenti dal database
  // Per ora, restituiamo dati di esempio
  const appointments = [
    { id: 1, userId: 1, date: '2023-05-20', time: '10:00' },
    { id: 2, userId: 2, date: '2023-05-21', time: '14:30' },
  ];
  res.json(appointments);
});

module.exports = router;
