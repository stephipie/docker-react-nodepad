// Importiere das DB-Modul mit der Pool-Instanz
import { query } from '../db.js';
// Alle Items abrufen (SELECT)
async function findAllItems() {
    try {
        const notes = await query('SELECT id, title, content, is_completed FROM notes ORDER BY created_at ASC;');
        return notes.rows; // Gibt Array von Item-Objekten zurück
        
    } catch (error) {  
        console.error('Fehler beim Abrufen der Notizen:', error);
        throw error; // Fehler weitergeben        
    }
}

// Ein Item anhand der ID abrufen (SELECT)
async function findItemById(id) {
    try {
        const res = await query('SELECT id, title, content, is_completed FROM notes WHERE id = $1;', [id]);
        return res.rows[0]; // Gibt das Item-Objekt zurück
        
    } catch (error) {
        console.error('Fehler beim Abrufen der Notiz:', error);
        throw error; // Fehler weitergeben        
    }
}

// Ein neues Item erstellen (INSERT)
async function createItem(item) {
    try {
        const res = await query('INSERT INTO notes (title, content, is_completed) VALUES ($1, $2, $3) RETURNING id;', [item.title, item.content, item.is_completed]);
        return res.rows[0]; // Gibt das neu erstellte Item-Objekt zurück
        
    } catch (error) {
        console.error('Fehler beim Erstellen der Notiz:', error);
        throw error; // Fehler weitergeben        
    }
}

// Ein Item aktualisieren (UPDATE)
async function updateItem(id, item) {
    try {
        const res = await query('UPDATE notes SET title = $1, content = $2, is_completed = $3 WHERE id = $4 RETURNING id;', [item.title, item.content, item.is_completed, id]);
        return res.rows[0]; // Gibt das aktualisierte Item-Objekt zurück
        
    } catch (error) {
        console.error('Fehler beim Aktualisieren der Notiz:', error);
        throw error; // Fehler weitergeben        
    }
}

// Ein Item löschen (DELETE)
async function deleteItem(id) {
    try {
        const res = await query('DELETE FROM notes WHERE id = $1 RETURNING id;', [id]);
        return res.rows[0]; // Gibt das gelöschte Item-Objekt zurück
        
    } catch (error) {
        console.error('Fehler beim Löschen der Notiz:', error);
        throw error; // Fehler weitergeben        
    }
}

// async function updateItem(id, item) {
//     const res = await query('UPDATE notes SET title = $1, content = $2, is_completed = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING id, title, content, is_completed;', [item.title, item.content, item.is_completed, id]);
//     return res.rows[0];
//   }

export {
    findAllItems,
    findItemById,
    createItem,
    updateItem,
    deleteItem
};