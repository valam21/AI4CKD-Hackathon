-- Table Patients
CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    date_naissance DATE NOT NULL,
    antecedents_medicaux TEXT
);

-- Table Consultations
CREATE TABLE IF NOT EXISTS consultations (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    date_consultation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    creatinine REAL NOT NULL,
    tension_arterielle_systolique REAL NOT NULL,
    tension_arterielle_diastolique REAL NOT NULL,
    poids REAL NOT NULL,
    notes_cliniques TEXT
);

-- Table Alertes
CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    consultation_id INTEGER NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
    type_alerte VARCHAR(100) NOT NULL,
    message_alerte TEXT NOT NULL,
    date_declenchement TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut VARCHAR(50) DEFAULT 'active'
);

-- Table Users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' -- Ex: 'admin', 'doctor', 'user'
);