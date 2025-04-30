import { useState } from 'react';
import NoteInput from './components/NoteInput';
import NoteList from './components/NoteList';

function App() {
  const [notes, setNotes] = useState([]);

  const addNote = (newNote) => {
    setNotes([...notes, newNote]);
  };

  const deleteNote = (noteToDelete) => {
    setNotes(notes.filter((note) => note !== noteToDelete));
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