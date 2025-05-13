import NoteItem from './NoteItem';

function NoteList({ notes, onDeleteNote, onToggleComplete }) {
  return (
    <ul>
      {notes.map((note) => (
        <NoteItem key={note.id} note={note} onDeleteNote={onDeleteNote} onToggleComplete={onToggleComplete}/>
      ))}
      {notes.length === 0 && <p>Noch keine Notizen vorhanden.</p>}
    </ul>
  );
}

export default NoteList;