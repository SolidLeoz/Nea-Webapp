# Nea Web Agency

Applicazione web full-stack per un'agenzia web che offre servizi digitali, blog e gestione appuntamenti.

## 🚀 Tecnologie Utilizzate

### Backend
- Node.js
- Express.js
- MongoDB (con Mongoose)
- Passport.js per autenticazione
- JWT per la gestione delle sessioni

### Frontend
- Next.js
- React
- Tailwind CSS
- TypeScript

## 📁 Struttura del Progetto

```
nea_app/
├── backend/                 # Server Express
│   ├── config/             # Configurazioni (database, etc.)
│   ├── controllers/        # Controller delle API
│   ├── middleware/         # Middleware personalizzati
│   ├── models/            # Modelli Mongoose
│   └── routes/            # Route delle API
│
└── frontend/              # Applicazione Next.js
    ├── components/        # Componenti React riutilizzabili
    ├── pages/            # Route e pagine Next.js
    ├── styles/           # Stili globali e componenti
    └── utils/            # Utility e helper functions
```

## 🛠️ Installazione

1. Clona il repository
\`\`\`bash
git clone [url-repository]
\`\`\`

2. Installa le dipendenze del backend
\`\`\`bash
cd backend
npm install
\`\`\`

3. Installa le dipendenze del frontend
\`\`\`bash
cd frontend
npm install
\`\`\`

4. Configura le variabili d'ambiente
- Copia `.env.example` in `.env` sia nella cartella backend che frontend
- Configura le variabili d'ambiente necessarie

## ⚙️ Configurazione

### Backend
Crea un file \`.env\` nella cartella backend con:
\`\`\`
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_uri
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret
BACKEND_URL=http://localhost:5000        # Importante per Google OAuth
FRONTEND_URL=http://localhost:3000       # Per il reindirizzamento post-login
\`\`\`

### Google OAuth Setup
1. Vai alla Google Cloud Console
2. Crea un nuovo progetto o seleziona uno esistente
3. Abilita Google+ API
4. Configura le credenziali OAuth:
   - Tipo: Applicazione Web
   - Nome: Nea Web Agency
   - URI di reindirizzamento autorizzati: `http://localhost:5000/api/auth/google/callback`
   - Origini JavaScript autorizzate: 
     * `http://localhost:3000`
     * `http://localhost:5000`

### Frontend
Crea un file \`.env\` nella cartella frontend con:
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
\`\`\`

## 🚀 Avvio dell'applicazione

1. Avvia il backend
\`\`\`bash
cd backend
npm run dev
\`\`\`

2. Avvia il frontend
\`\`\`bash
cd frontend
npm run dev
\`\`\`

L'applicazione sarà disponibile su:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📋 Funzionalità Principali

- **Autenticazione**
  - Login con Google OAuth
  - Gestione sessioni JWT
  - Protezione delle route
  - Ruoli utente (admin e utente standard)

- **Blog**
  - Creazione e gestione post
  - Visualizzazione post
  - Dashboard admin per la gestione

- **Servizi**
  - Presentazione servizi dell'agenzia
  - Richiesta preventivi
  - Gestione appuntamenti

- **Area Admin**
  - Gestione contenuti
  - Gestione utenti
  - Analytics
  - Gestione completa appuntamenti

- **Dashboard Utente**
  - Visualizzazione personalizzata degli appuntamenti
  - Interfaccia adattiva basata sul ruolo:
    * Admin: gestione completa di utenti, appuntamenti e post
    * Utente standard: visualizzazione dei propri appuntamenti

## 🔗 API Endpoints

### Autenticazione
- `POST /api/auth/login` - Login utente
- `POST /api/auth/google` - Login con Google
- `GET /api/auth/google/callback` - Callback Google OAuth
- `POST /api/auth/logout` - Logout utente

### Utenti
- `GET /api/users` - Lista utenti (admin)
- `GET /api/users/:id` - Dettaglio utente
- `PUT /api/users/:id` - Aggiorna utente

### Post
- `GET /api/posts` - Lista post
- `POST /api/posts` - Crea nuovo post (admin)
- `GET /api/posts/:id` - Dettaglio post
- `PUT /api/posts/:id` - Aggiorna post (admin)
- `DELETE /api/posts/:id` - Elimina post (admin)

### Appuntamenti
- `GET /api/appointments` - Lista tutti gli appuntamenti (admin)
- `GET /api/appointments/my` - Lista appuntamenti personali (utente)
- `POST /api/appointments` - Crea appuntamento
- `PUT /api/appointments/:id` - Aggiorna appuntamento (admin)
- `PATCH /api/appointments/:id/status` - Aggiorna stato appuntamento (admin)
- `DELETE /api/appointments/:id` - Elimina appuntamento (admin)

## 👥 Contribuire

1. Fai il fork del progetto
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Committa i tuoi cambiamenti (`git commit -m 'Add some AmazingFeature'`)
4. Pusha sul branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📝 License

Distribuito sotto licenza MIT. Vedi `LICENSE` per maggiori informazioni.
