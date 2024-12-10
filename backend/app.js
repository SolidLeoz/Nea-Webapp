/**
 * Configurazione principale dell'applicazione Express
 * Questo file gestisce:
 * - Middleware e configurazioni
 * - Autenticazione con Passport e Google OAuth
 * - Connessione al database
 * - Routing delle API
 * - Gestione degli errori
 */

const dotenv = require('dotenv');
dotenv.config(); // Carica le variabili d'ambiente dal file .env

// Importazione delle dipendenze necessarie
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const appointmentRoutes = require('./routes/appointments');
const postRoutes = require('./routes/posts');
const passport = require('passport');
const session = require('express-session');

// Verifica delle credenziali Google necessarie per l'autenticazione OAuth
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error('Credenziali Google mancanti. Assicurati che GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET siano impostati nel file .env');
  process.exit(1);
}

const app = express();

/**
 * Configurazione dei middleware principali
 * - cors: Gestisce le richieste Cross-Origin
 * - express.json: Parsing del body delle richieste in formato JSON
 */
app.use(cors());
app.use(express.json());

/**
 * Configurazione della sessione utente
 * - secret: Chiave per firmare il cookie di sessione
 * - resave: Salva la sessione anche se non modificata
 * - saveUninitialized: Salva sessioni anche non inizializzate
 * - cookie.secure: Usa HTTPS in produzione
 */
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

/**
 * Configurazione di Passport per l'autenticazione
 * Inizializza Passport e ripristina le sessioni autenticate
 */
app.use(passport.initialize());
app.use(passport.session());

/**
 * Gestione della serializzazione dell'utente per le sessioni
 * Determina quali dati dell'utente vengono salvati nel cookie di sessione
 */
passport.serializeUser((user, done) => {
  done(null, user.id);
});

/**
 * Gestione della deserializzazione dell'utente
 * Recupera i dati dell'utente dal database usando l'ID salvato nella sessione
 */
passport.deserializeUser((id, done) => {
  // TODO: Implementare il recupero dell'utente dal database
  done(null, { id: id });
});

// Inizializza la connessione al database MongoDB
connectDB();

/**
 * Configurazione delle routes dell'API
 * - /api/auth: Gestione autenticazione e registrazione
 * - /api/users: Gestione profili utente
 * - /api/appointments: Gestione appuntamenti
 * - /api/posts: Gestione post del blog
 */
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/posts', postRoutes);

// Route principale per verificare che l'API sia attiva
app.get('/', (req, res) => {
  res.json({ message: 'Benvenuto all\'API del backend!' });
});

/**
 * Middleware globale per la gestione degli errori
 * Cattura tutti gli errori non gestiti e invia una risposta appropriata
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Si è verificato un errore interno del server' });
});

// Esporta l'app configurata per essere utilizzata in server.js
module.exports = app;
