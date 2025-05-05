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

  const addNote = async (newNoteText) => {
    try {
      const response = await fetch(`${apiUrl}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newNoteText, content: newNoteText }), // Backend erwartet title und content
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
      const response = await fetch(`${apiUrl}/notes/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setNotes(notes.filter((note) => note.id !== id));
    } catch (error) {
      console.error(`Fehler beim Löschen der Notiz mit ID ${id}:`, error);
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