function NoteItem({ note, onDeleteNote, onToggleComplete }) {
  const handleChange = (event) => {
    onToggleComplete(note.id, note.is_completed);
  };

  return (
    <li>
      <strong>{note.title}</strong>
      <p>{note.content}</p>
      <div>
        <label>
          Erledigt:
          <input
            type="checkbox"
            checked={note.is_completed}
            onChange={handleChange}
          />
        </label>
      </div>
      <button onClick={() => onDeleteNote(note.id)}>Löschen</button>
    </li>
  );
}

export default NoteItem;