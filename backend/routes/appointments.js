const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Appointment = require('../models/Appointment');

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

// Ottieni tutti gli appuntamenti
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Recupera gli appuntamenti dal database
    const appointments = await Appointment.find()
      .populate('userId', 'name email') // Include i dettagli dell'utente
      .sort({ date: 1, time: 1 }); // Ordina per data e ora

    res.json(appointments);
  } catch (error) {
    console.error('Errore nel recupero degli appuntamenti:', error);
    res.status(500).json({ message: 'Errore nel recupero degli appuntamenti' });
  }
});

// Crea un nuovo appuntamento
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { date, time, service, notes } = req.body;
    
    // Crea un nuovo appuntamento
    const appointment = new Appointment({
      userId: req.user.id, // ID dell'utente dal token JWT
      date,
      time,
      service,
      notes
    });

    // Salva l'appuntamento nel database
    const savedAppointment = await appointment.save();
    
    res.status(201).json(savedAppointment);
  } catch (error) {
    console.error('Errore nella creazione dell\'appuntamento:', error);
    res.status(500).json({ message: 'Errore nella creazione dell\'appuntamento' });
  }
});

// Aggiorna lo stato di un appuntamento
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    
    // Verifica che il nuovo stato sia valido
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Stato non valido' });
    }

    // Aggiorna lo stato dell'appuntamento
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true } // Restituisce il documento aggiornato
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appuntamento non trovato' });
    }

    res.json(appointment);
  } catch (error) {
    console.error('Errore nell\'aggiornamento dello stato:', error);
    res.status(500).json({ message: 'Errore nell\'aggiornamento dello stato' });
  }
});

// Elimina un appuntamento
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appuntamento non trovato' });
    }

    res.json({ message: 'Appuntamento eliminato con successo' });
  } catch (error) {
    console.error('Errore nell\'eliminazione dell\'appuntamento:', error);
    res.status(500).json({ message: 'Errore nell\'eliminazione dell\'appuntamento' });
  }
});

module.exports = router;
