const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.isAdmin = async (req, res, next) => {
  console.error('Middleware isAdmin iniziato');
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.error('Token ricevuto:', token ? token.substring(0, 20) + '...' : 'Mancante');
    
    if (!token) {
      console.error('Token mancante, invio risposta 401');
      return res.status(401).json({ message: 'Accesso negato. Token mancante.' });
    }

    console.error('JWT_SECRET:', process.env.JWT_SECRET ? 'Presente' : 'Mancante');
    console.error('Verifica del token in corso...');
    
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.error('Token decodificato:', decoded);
    } catch (jwtError) {
      console.error('Errore nella verifica del token:', jwtError.message);
      return res.status(401).json({ message: 'Token non valido.' });
    }

    console.error('Ricerca utente nel database...');
    const user = await User.findById(decoded.id);
    console.error('Utente trovato:', user ? 'Sì' : 'No');

    if (!user) {
      console.error('Utente non trovato, invio risposta 401');
      return res.status(401).json({ message: 'Utente non trovato.' });
    }

    console.error('Ruolo utente:', user.role);
    if (user.role !== 'admin') {
      console.error('Utente non admin, invio risposta 403');
      return res.status(403).json({ message: 'Accesso negato. Solo gli admin possono eseguire questa azione.' });
    }

    console.error('Utente admin verificato, passaggio al prossimo middleware');
    req.user = user;
    next();
  } catch (error) {
    console.error('Errore nel middleware isAdmin:', error);
    res.status(401).json({ message: 'Token non valido.' });
  }
};
