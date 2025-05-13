import { useState, useEffect } from 'react';
import NoteInput from './components/NoteInput';
import NoteList from './components/NoteList';

function App() {
  const [notes, setNotes] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`${apiUrl}/notes`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Fehler beim Laden der Notizen:', error);
    }
  };

  const addNote = async (newNote) => {
    try {
      const response = await fetch(`${apiUrl}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newNote, is_completed: false }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setNotes([...notes, data]);
    } catch (error) {
      console.error('Fehler beim Hinzufügen der Notiz:', error);
    }
  };

  const deleteNote = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/notes/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setNotes(notes.filter((note) => note.id !== id));
    } catch (error) {
      console.error(`Fehler beim Löschen der Notiz mit ID ${id}:`, error);
    }
  };

  // In App.jsx
const toggleComplete = async (id, isCompleted) => {
  try {
    const response = await fetch(`<span class="math-inline">\{apiUrl\}/notes/</span>{id}`, {
      method: 'PUT', // Oder 'PATCH'
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_completed: !isCompleted }), // Toggle den aktuellen Status
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const updatedNote = await response.json();
    // Aktualisiere den lokalen State, um die Änderung widerzuspiegeln
    setNotes(notes.map(note =>
      note.id === id ? { ...note, is_completed: updatedNote.is_completed } : note
    ));
  } catch (error) {
    console.error(`Fehler beim Aktualisieren des Status der Notiz mit ID ${id}:`, error);
  }
};

  return (
    <div>
      <h1>Mein Mini-Notizblock</h1>
      <NoteInput onAddNote={addNote} />
      <NoteList notes={notes} onDeleteNote={deleteNote} />
    </div>
  );
}

export default App;