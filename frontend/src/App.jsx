import { useState, useEffect } from 'react';
import NoteInput from './components/NoteInput';
import NoteList from './components/NoteList';

function App() {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  // Lade Notizen beim ersten Render
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`/${apiUrl}/notes`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      setError(error);
      console.error('Fehler beim Laden der Notizen:', error);
    }
  };

  const addNote = async (newNote) => {
    try {
      const response = await fetch(`/${apiUrl}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: newNote.title,
          content: newNote.content,
          is_completed: false 
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const createdNote = await response.json();
      console.info('Neue Notiz erstellt:', createdNote);
      
      // Hole die aktuellen Notizen neu, um sicherzustellen, dass alle Daten korrekt sind
      await fetchNotes();
    } catch (error) {
      setError(error);
      console.error('Fehler beim Hinzufügen der Notiz:', error);
    }
  };

  const deleteNote = async (id) => {
    try {
      const response = await fetch(`/${apiUrl}/notes/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setNotes(notes.filter((note) => note.id !== id));
      console.info(`Notiz mit ID ${id} gelöscht`);
    } catch (error) {
      console.error(`Fehler beim Löschen der Notiz mit ID ${id}:`, error);
    }
  };

  const toggleComplete = async (id, isCompleted) => {
    try {
      // Finde die aktuelle Notiz
      const currentNote = notes.find(note => note.id === id);
      console.log("Gefundene Notiz:", currentNote); // Zeigt die gefundene Notiz
      if (!currentNote) {
        console.error(`Notiz mit ID ${id} nicht gefunden.`);
        return;
      }

      console.log("Daten vor dem Senden:", {
        title: currentNote.title,
        content: currentNote.content,
        is_completed: !isCompleted
      });

      const response = await fetch(`/${apiUrl}/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: currentNote.title,
          content: currentNote.content,
          is_completed: !isCompleted
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
      }

      const updatedNote = await response.json();
      console.log('Aktualisierte Notiz:', updatedNote);

      // Aktualisiere den Status mit den Daten vom Server
      setNotes(notes.map(note =>
        note.id === id ? { ...currentNote, is_completed: !isCompleted } : note
      ));
    } catch (error) {
      console.error(`Fehler beim Aktualisieren des Status der Notiz mit ID ${id}:`, error);
      setError(error);
    }
  };

  return (
    <div>
      <h1>Mein Mini-Notizblock</h1>
      {error && <p className="error">{error.message}</p>}
      <p>Hier können Sie Ihre Notizen hinzufügen, löschen und den Status ändern.</p>
      <NoteInput onAddNote={addNote} />
      <NoteList notes={notes} onDeleteNote={deleteNote} onToggleComplete={toggleComplete}/>
    </div>
  );
}

export default App;