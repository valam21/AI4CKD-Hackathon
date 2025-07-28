import express from 'express';
import dotenv from 'dotenv';
import db from './config/db';
import patientRoutes from './routes/patientRoutes';
import cors from 'cors'; // Importez le module cors

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configurez CORS pour autoriser les requêtes depuis votre frontend Next.js
// En développement, il est courant d'autoriser toutes les origines (*) ou spécifiquement localhost:3000
app.use(cors({
  origin: 'http://localhost:3000', // Remplacez par l'URL de votre frontend si différente
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Autorisez les méthodes HTTP que votre API utilise
  allowedHeaders: ['Content-Type', 'Authorization'], // Autorisez les headers que votre API utilise
}));

app.use(express.json()); // Middleware pour parser le JSON

// Test de connexion à la base de données au démarrage
db.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err.stack);
  } else {
    console.log('Connexion à la base de données réussie. Heure actuelle:', res.rows[0].now);
  }
});

// Utilisation des routes
app.use('/api/patients', patientRoutes);

app.get('/', (req, res) => {
  res.send('API AI4CKD Hackathon en cours d\'exécution !');
});

app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur le port ${PORT}`);
  console.log(`Accédez à http://localhost:${PORT}`);
});