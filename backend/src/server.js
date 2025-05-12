// const express = require('express');
import express from 'express'; // Express importieren
// const notesRoutes = require('./routes/notes');
import notesRoutes from './routes/notes.js'; // Routen für Notizen importieren
// const dotenv = require('dotenv');
import dotenv from 'dotenv'; // Umgebungsvariablen importieren
// const cors = require('cors'); //CORS Middleware importieren
import cors from 'cors'; // CORS Middleware importieren
// const loadNotes = require('./middleware/loadNotes'); // Middleware zum Laden der Notizen
import loadNotes from './middleware/loadNotes.js'; // Middleware zum Laden der Notizen
// const saveNotes = require('./middleware/saveNotes'); // Middleware zum Speichern der Notizen
import saveNotes from './middleware/saveNotes.js'; // Middleware zum Speichern der Notizen
// const logger = require('./config/logger'); // Logger importieren
import logger from './config/logger.js'; // Logger importieren

dotenv.config(); // Lädt Umgebungsvariablen aus der .env-Datei

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware zum Parsen von JSON-Anfragen
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:5173' ]// Nur Anfragen von diesen Origins erlauben
}));

// Middleware zum Laden der Daten beim Start
app.use(loadNotes);

// Middleware zum Speichern der Daten nach jeder Anfrage, die Daten modifiziert
app.use(saveNotes);

// Routen für Notizen einbinden
app.use('/api/notes', notesRoutes);

// Grundlegende Fehlerbehandlung für nicht gefundene Routen (404)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Nicht gefunden' });
});

app.listen(port, () => {
  logger.info('Starting backend API...'); // Verwende den Logger
  logger.info('Database Configuration (received via ENV):', {
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USER: process.env.DB_USER,
    DB_NAME: process.env.DB_NAME,
    DB_PASSWORD: process.env.DB_PASSWORD ? '[REDACTED]' : 'N/A'
  });
  logger.info('-------------------------------------------');
  logger.info(`Server läuft auf http://localhost:${port}`); // Verwende den Logger
});