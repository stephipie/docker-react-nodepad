import NoteItem from './NoteItem';

function NoteList({ notes, onDeleteNote }) {
  return (
    <ul>
      {notes.map((note) => (
        <NoteItem key={note.id} note={note} onDeleteNote={onDeleteNote} />
      ))}
      {notes.length === 0 && <p>Noch keine Notizen vorhanden.</p>}
    </ul>
  );
}

export default NoteList;