// src/middleware/saveNotes.js
const fs = require('fs').promises;
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data'); // Einmal nach oben, dann in 'data'
const dataFile = path.join(dataDir, 'notes.json');

const saveNotes = async (req, res, next) => {
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
};

module.exports = saveNotes;