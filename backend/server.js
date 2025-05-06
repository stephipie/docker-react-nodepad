const express = require('express');
const notesRoutes = require('./routes/notes');
const dotenv = require('dotenv');
const cors = require('cors'); //CORS Middleware importieren
const fs = require('fs').promises; //fs importieren, Promise-basierte Version
const path = require('path'); // path importieren

dotenv.config(); // Lädt Umgebungsvariablen aus der .env-Datei

const app = express();
const port = process.env.PORT || 3000;
const dataDir = path.join(__dirname, 'data'); // Verzeichnis für die Daten
const dataFile = path.join(dataDir, 'notes.json'); // Pfad zur JSON-Datei

app.use(express.json()); // Middleware zum Parsen von JSON-Anfragen
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:5173' ]// Nur Anfragen von diesen Origins erlauben
}));

// Middleware zum Laden der Daten beim Start
app.use(async (req, res, next) => {
  try {
    await fs.mkdir(dataDir, { recursive: true }); // Sicherstellen, dass das Verzeichnis existiert
    const fileExists = await fs.access(dataFile).then(() => true).catch(() => false);
    if (fileExists) {
      const data = await fs.readFile(dataFile, 'utf-8');
      req.notesData = JSON.parse(data);
    } else {
      req.notesData = [];
      console.log('notes.json nicht gefunden. Starte mit einem leeren Datensatz.');
    }
    next();
  } catch (error) {
    console.error('Fehler beim Laden der Daten:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Daten' });
  }
});

// Middleware zum Speichern der Daten nach jeder Anfrage, die Daten modifiziert
app.use(async (req, res, next) => {
  const originalSend = res.send;
  res.send = async function (body) {
    if (req.method === 'POST' || req.method === 'DELETE') {
      try {
        await fs.writeFile(dataFile, JSON.stringify(req.notesData, null, 2), 'utf-8');
        console.log('Daten erfolgreich in notes.json gespeichert.');
      } catch (error) {
        console.error('Fehler beim Speichern der Daten:', error);
      }
    }
    return originalSend.call(this, body);
  };
  next();
});

// Routen für Notizen einbinden
app.use('/api/notes', notesRoutes);

// Grundlegende Fehlerbehandlung für nicht gefundene Routen (404)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Nicht gefunden' });
});

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});