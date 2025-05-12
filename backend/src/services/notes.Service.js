// Importiere das DB-Modul mit der Pool-Instanz
import { query } from '../db.js';
// Alle Items abrufen (SELECT)
async function findAllItems() {
 const res = await query('SELECT id, title, content, is_completed FROM notes ORDER BY created_at ASC;');
 return res; // Gibt Array von Item-Objekten zurück
}

// Ein Item anhand der ID abrufen (SELECT)
async function findItemById(id) {
 const res = await query('SELECT id, title, content, is_completed FROM notes WHERE id = $1;', [id]);
 return res.rows[0]; // Gibt das Item-Objekt zurück
}

// Ein neues Item erstellen (INSERT)
async function createItem(item) {
 const res = await query('INSERT INTO notes (title, content, is_completed) VALUES ($1, $2, $3) RETURNING id;', [item.title, item.content, item.is_completed]);
 return res.rows[0]; // Gibt das neu erstellte Item-Objekt zurück
}

// Ein Item aktualisieren (UPDATE)
async function updateItem(id, item) {
 const res = await query('UPDATE notes SET title = $1, content = $2, is_completed = $3 WHERE id = $4 RETURNING id;', [item.title, item.content, item.is_completed, id]);
 return res.rows[0]; // Gibt das aktualisierte Item-Objekt zurück
}

// Ein Item löschen (DELETE)
async function deleteItem(id) {
 const res = await query('DELETE FROM notes WHERE id = $1 RETURNING id;', [id]);
 return res.rows[0]; // Gibt das gelöschte Item-Objekt zurück
}

export {
 findAllItems,
 findItemById,
 createItem,
 updateItem,
 deleteItem
};