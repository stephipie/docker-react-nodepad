function NoteItem({ note, onDeleteNote }) {
    return (
      <li>
        {note}
        <button onClick={() => onDeleteNote(note)}>Löschen</button>
      </li>
    );
  }
  
  export default NoteItem;