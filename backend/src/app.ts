import express from 'express';
import dotenv from 'dotenv';
import db from './config/db';
import patientRoutes from './routes/patientRoutes';
import authRoutes from './routes/authRoutes'; // Importez les routes d'authentification
import { authenticateToken } from './middleware/authMiddleware'; // Importez le middleware d'authentification
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Test de connexion à la base de données au démarrage
db.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err.stack);
  } else {
    console.log('Connexion à la base de données réussie. Heure actuelle:', res.rows[0].now);
  }
});

// Routes publiques (authentification)
app.use('/api/auth', authRoutes);

// Routes protégées par l'authentification
// Toutes les routes sous /api/patients nécessiteront un token valide
app.use('/api/patients', authenticateToken, patientRoutes);

app.get('/', (req, res) => {
  res.send('API AI4CKD Hackathon en cours d\'exécution !');
});

app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur le port ${PORT}`);
  console.log(`Accédez à http://localhost:${PORT}`);
});