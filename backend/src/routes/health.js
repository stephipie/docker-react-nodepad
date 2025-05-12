import logger from '../config/logger.js'; // Logger importieren
import express from 'express'; // Express importieren
import { testDbConnection } from '../db.js'; // Importiere die Funktion zum Testen der DB-Verbindung
const router = express.Router(); // Router für die API erstellen
// create a helath route, if test connection is successful, return 200 OK
router.get('/', async (req, res) => {
  logger.info('GET /api/health');
  try {
    await testDbConnection();
    res.status(200).json({ status: 'OK' });
  } catch (err) {
    logger.error('Healthcheck failed:', err);
    res.status(500).json({ status: 'Database connection failed' });
  }
});

export default router;