function NoteItem({ note, onDeleteNote }) {
  return (
    <li>
      <strong>{note.title}</strong> {/* Anzeige des Titels */}
      <p>{note.content}</p>   {/* Anzeige des Inhalts */}
      <button onClick={() => onDeleteNote(note.id)}>Löschen</button> {/* Übergabe der ID zum Löschen */}
    </li>
  );
}

export default NoteItem;