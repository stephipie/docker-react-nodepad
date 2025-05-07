const express = require('express');
const notesRoutes = require('./routes/notes');
const dotenv = require('dotenv');
const cors = require('cors'); //CORS Middleware importieren
const loadNotes = require('./middleware/loadNotes'); // Middleware zum Laden der Notizen
const saveNotes = require('./middleware/saveNotes'); // Middleware zum Speichern der Notizen

dotenv.config(); // Lädt Umgebungsvariablen aus der .env-Datei

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware zum Parsen von JSON-Anfragen
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:5173' ]// Nur Anfragen von diesen Origins erlauben
}));

// Middleware zum Laden der Daten beim Start
app.use(loadNotesMiddleware);

// Middleware zum Speichern der Daten nach jeder Anfrage, die Daten modifiziert
app.use(saveNotesMiddleware);

// Routen für Notizen einbinden
app.use('/api/notes', notesRoutes);

// Grundlegende Fehlerbehandlung für nicht gefundene Routen (404)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Nicht gefunden' });
});

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});