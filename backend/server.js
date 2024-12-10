// Importa l'applicazione Express configurata
const app = require('./app');

// Configurazione della porta
const PORT = process.env.PORT || 5001;

// Avvio del server
app.listen(PORT, () => {
  console.log(`Server in esecuzione sulla porta ${PORT}`);
  console.log('Credenziali Google caricate correttamente');
});
