// src/middleware/loadNotes.js
const fs = require('fs').promises;
const path = require('path');
const logger = require('../config/logger'); 

const dataDir = path.join(__dirname, '..', 'data'); // Einmal nach oben, dann in 'data'
const dataFile = path.join(dataDir, 'notes.json');

const loadNotes = async (req, res, next) => {
    try {
      await fs.mkdir(dataDir, { recursive: true });
      const fileExists = await fs.access(dataFile).then(() => true).catch(() => false);
      if (fileExists) {
        const data = await fs.readFile(dataFile, 'utf-8');
        req.notesData = JSON.parse(data);
      } else {
        req.notesData = [];
        logger.info('notes.json nicht gefunden. Starte mit einem leeren Datensatz.'); // Verwende den Logger
      }
      next();
    } catch (error) {
      logger.error('Fehler beim Laden der Daten:', error); // Verwende den Logger
      res.status(500).json({ error: 'Fehler beim Laden der Daten' });
    }
  };

module.exports = loadNotes;