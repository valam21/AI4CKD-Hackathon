export interface User {
  id?: number;
  email: string;
  password: string; // Stockera le mot de passe haché
  role?: string;
}

export interface UserPayload {
  id: number;
  email: string;
  role: string;
}