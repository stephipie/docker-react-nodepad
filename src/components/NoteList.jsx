import NoteItem from './NoteItem';

function NoteList({ notes, onDeleteNote }) {
  return (
    <ul>
      {notes.map((note, index) => (
        <NoteItem key={index} note={note} onDeleteNote={onDeleteNote} />
      ))}
    </ul>
  );
}

export default NoteList;