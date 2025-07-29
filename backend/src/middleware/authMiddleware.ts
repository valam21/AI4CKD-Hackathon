import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserPayload } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey'; // Doit correspondre à celui du contrôleur d'auth

// Étendre l'interface Request d'Express pour inclure user
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload; // Ajoute la propriété user à l'objet Request
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer TOKEN

  if (token == null) {
    return res.status(401).json({ message: 'Accès non autorisé : aucun token fourni.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Erreur de vérification du token:', err.message);
      return res.status(403).json({ message: 'Accès interdit : token invalide ou expiré.' });
    }
    req.user = user as UserPayload; // Attache le payload du user à la requête
    next(); // Passe au middleware/route suivant
  });
};