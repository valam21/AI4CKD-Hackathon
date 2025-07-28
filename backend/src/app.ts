import express from 'express';
import dotenv from 'dotenv';
import db from './config/db'; // Importez le pool de connexion

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Test de connexion à la base de données au démarrage
db.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err.stack);
  } else {
    console.log('Connexion à la base de données réussie. Heure actuelle:', res.rows[0].now);
  }
});

app.get('/', (req, res) => {
  res.send('API AI4CKD Hackathon en cours d\'exécution !');
});

app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur le port ${PORT}`);
  console.log(`Accédez à http://localhost:${PORT}`);
});