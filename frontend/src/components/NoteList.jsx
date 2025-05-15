import NoteItem from './NoteItem';

function NoteList({ notes = [], onDeleteNote, onToggleComplete }) {
  // Debugging: Logge notes wenn sie sich ändern
  console.log('NoteList rendering with notes:', notes);

  if (!Array.isArray(notes)) {
    console.error('notes is not an array:', notes);
    return null;
  }

  return (
    <ul className="note-list">
      {notes.map((note) => (
        <NoteItem 
          key={note.id} 
          note={note} 
          onDeleteNote={onDeleteNote} 
          onToggleComplete={onToggleComplete}
        />
      ))}
      {notes.length === 0 && <p>Noch keine Notizen vorhanden.</p>}
    </ul>
  );
}

export default NoteList;