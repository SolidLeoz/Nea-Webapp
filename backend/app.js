const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const appointmentRoutes = require('./routes/appointments');
const postRoutes = require('./routes/posts');
const passport = require('passport');
const session = require('express-session');

// Verifica delle credenziali Google
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error('Credenziali Google mancanti. Assicurati che GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET siano impostati nel file .env');
  process.exit(1);
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configurazione di express-session
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Inizializzazione di Passport
app.use(passport.initialize());
app.use(passport.session());

// Configurazione della serializzazione e deserializzazione dell'utente per Passport
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // Qui dovresti recuperare l'utente dal database usando l'id
  // Per ora, passiamo semplicemente l'id come utente
  done(null, { id: id });
});

// Connessione al database
connectDB();

// Rotte
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/posts', postRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Benvenuto all\'API del backend!' });
});

// Gestione globale degli errori
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Si è verificato un errore interno del server' });
});

// Esporta l'app per essere utilizzata in server.js
module.exports = app;
