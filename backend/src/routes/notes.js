import express from 'express';
import logger from '../config/logger.js';
import { 
  findAllItems, 
  findItemById, 
  createItem, 
  deleteItem,
  updateItem 
} from '../services/notes.Service.js';

const router = express.Router();

// GET /api/notes (Alle Notizen abrufen)
router.get('/', async (req, res) => {
  try {
    const data = await findAllItems();
    logger.info('GET /api/notes - Notizen abgerufen', { data });
    res.json(data);
  } catch (error) {
    logger.error('GET /api/notes - Fehler beim Abrufen der Notizen', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

// GET /api/notes/:id (Eine einzelne Notiz abrufen)
router.get('/:id', async (req, res) => {
  const noteId = parseInt(req.params.id);
  try {
    const note = await findItemById(noteId);
    if (note) {
      logger.info(`GET /api/notes/${noteId} - Notiz gefunden`);
      res.json(note);
    } else {
      logger.warn(`GET /api/notes/${noteId} - Notiz nicht gefunden`);
      res.status(404).json({ error: 'Notiz nicht gefunden' });
    }
  } catch (error) {
    logger.error(`GET /api/notes/${noteId} - Fehler:`, error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

// POST /api/notes (Eine neue Notiz erstellen)
router.post('/', async (req, res) => {
  const { title, content } = req.body;
  if (title && content) {
    try {
      const newNote = await createItem({ title, content, is_completed: false });
      logger.info(`POST /api/notes - Neue Notiz hinzugefügt: ${JSON.stringify(newNote)}`);
      res.status(201).json(newNote);
    } catch (error) {
      logger.error('POST /api/notes - Fehler beim Erstellen der Notiz', error);
      res.status(500).json({ error: 'Interner Serverfehler' });
    }
  } else {
    logger.error('POST /api/notes - Ungültige Daten');
    res.status(400).json({ error: 'Titel und Inhalt sind erforderlich' });
  }
});

// DELETE /api/notes/:id (Eine Notiz löschen)
router.delete('/:id', async (req, res) => {
  const noteId = parseInt(req.params.id);
  try {
    const deleted = await deleteItem(noteId);
    if (deleted) {
      logger.info(`DELETE /api/notes/${noteId} - Notiz gelöscht`);
      res.status(204).send();
    } else {
      logger.warn(`DELETE /api/notes/${noteId} - Notiz nicht gefunden`);
      res.status(404).json({ error: 'Notiz nicht gefunden' });
    }
  } catch (error) {
    logger.error(`DELETE /api/notes/${noteId} - Fehler:`, error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

// PUT /api/notes/:id (Eine bestehende Notiz aktualisieren)
router.put('/:id', async (req, res) => {
  const noteId = parseInt(req.params.id);
  const { title, content, is_completed } = req.body;
  if (title && content !== undefined && is_completed !== undefined) {
    try {
      const updatedNote = await updateItem(noteId, { title, content, is_completed });
      if (updatedNote) {
        logger.info(`PUT /api/notes/${noteId} - Notiz aktualisiert: ${JSON.stringify(updatedNote)}`);
        res.json(updatedNote);
      } else {
        logger.warn(`PUT /api/notes/${noteId} - Notiz nicht gefunden`);
        res.status(404).json({ error: 'Notiz nicht gefunden' });
      }
    } catch (error) {
      logger.error(`PUT /api/notes/${noteId} - Fehler beim Aktualisieren der Notiz`, error);
      res.status(500).json({ error: 'Interner Serverfehler' });
    }
  } else {
    logger.error(`PUT /api/notes/${noteId} - Ungültige Daten für die Aktualisierung`);
    res.status(400).json({ error: 'Titel, Inhalt und is_completed sind erforderlich' });
  }
});

export default router;