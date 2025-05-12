// const express = require('express');
// const router = express.Router();
// const logger = require('../config/logger'); 
import logger from '../config/logger.js'; // Logger importieren
import express from 'express'; // Express importieren
import router from express.Router(); // Router importieren

// Einfache In-Memory-Datenspeicherung für Notizen
// let notes = [];
// let nextId = 1;

// GET /api/notes (Alle Notizen abrufen)
router.get('/', (req, res) => {
  logger.info('GET /api/notes - Notizen aufgerufen'); // Logge den Aufruf
  res.json(req.notesData); // Alle Notizen zurückgeben
});

// GET /api/notes/:id (Eine einzelne Notiz anhand der ID abrufen)
router.get('/:id', (req, res) => {
  const noteId = parseInt(req.params.id);
  const note = req.notesData.find(n => n.id === noteId);

  if (note) {
    logger.info(`GET /api/notes/${noteId} - Notiz gefunden`); // Logge den Aufruf
    res.json(note);
  } else {
    logger.warn(`GET /api/notes/${noteId} - Notiz nicht gefunden`); // Logge den Fehler
    res.status(404).json({ error: 'Notiz nicht gefunden' });
  }
});

// POST /api/notes (Eine neue Notiz hinzufügen)
router.post('/', (req, res) => {
  const { title, content } = req.body;
  if (title && content) {
    const nextId = req.notesData.length ? Math.max(...req.notesData.map(n => n.id)) + 1 : 1;
    const newNote = { id: nextId, title, content };
    req.notesData.push(newNote); // Neue Notiz hinzufügen
    logger.info(`POST /api/notes - Neue Notiz hinzugefügt: ${JSON.stringify(newNote)}`); // Logge den Aufruf
    res.status(201).json(newNote);
  } else {
    logger.error('POST /api/notes - Ungültige Daten'); // Logge den Fehler
    res.status(400).json({ error: 'Titel und Inhalt sind erforderlich' });
  }
});

// DELETE /api/notes/:id (Eine Notiz anhand der ID löschen)
router.delete('/:id', (req, res) => {
  const noteId = parseInt(req.params.id);
  const initialLength = req.notesData.length;
  req.notesData = req.notesData.filter(n => n.id !== noteId);

  if (req.notesData.length < initialLength) {
    logger.info(`DELETE /api/notes/${noteId} - Notiz gelöscht`); // Logge den Aufruf
    res.status(204).send(); // Erfolgreich gelöscht, keine Antwort-Daten
  } else {
    logger.warn(`DELETE /api/notes/${noteId} - Notiz nicht gefunden`); // Logge den Fehler
    res.status(404).json({ error: 'Notiz nicht gefunden' });
  }
});

// module.exports = router;
export default router;