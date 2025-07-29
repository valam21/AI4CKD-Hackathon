import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db';
import { User, UserPayload } from '../models/User';
import { QueryResult } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey'; // Utilisez une clé secrète forte en production!

// Fonction d'enregistrement d'un nouvel utilisateur
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, role = 'user' } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser: QueryResult<User> = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10); // Le 10 est le "salt rounds"

    // Insérer le nouvel utilisateur dans la base de données
    const query = `
      INSERT INTO users (email, password, role)
      VALUES ($1, $2, $3)
      RETURNING id, email, role;
    `;
    const result: QueryResult<User> = await db.query(query, [email, hashedPassword, role]);
    const newUser = result.rows[0];

    // Créer un token JWT (optionnel lors de l'inscription, mais courant)
    const payload: UserPayload = { id: newUser.id!, email: newUser.email, role: newUser.role! };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'Utilisateur enregistré avec succès.', token, user: payload });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'enregistrement.' });
  }
};

// Fonction de connexion d'un utilisateur
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const result: QueryResult<User> = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
    }
    const user = result.rows[0];

    // Comparer le mot de passe fourni avec le mot de passe haché
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
    }

    // Créer un token JWT
    const payload: UserPayload = { id: user.id!, email: user.email, role: user.role! };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Token expire dans 1 heure

    res.status(200).json({ message: 'Connexion réussie.', token, user: payload });
  } catch (error) {
    console.error('Erreur lors de la connexion de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion.' });
  }
};