const express = require('express');
const notesRoutes = require('./routes/notes');
const dotenv = require('dotenv');
const cors = require('cors'); //CORS Middleware importieren

dotenv.config(); // Lädt Umgebungsvariablen aus der .env-Datei

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware zum Parsen von JSON-Anfragen
app.use(cors({
  origin: 'http://localhost:8080' // Nur Anfragen von dieser Origin erlauben
}));

// Routen für Notizen einbinden
app.use('/api/notes', notesRoutes);

// Grundlegende Fehlerbehandlung für nicht gefundene Routen (404)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Nicht gefunden' });
});

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});