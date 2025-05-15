function NoteItem({ note, onDeleteNote, onToggleComplete }) {
  const handleChange = () => {
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
            checked={note.is_completed || false}
            onChange={handleChange}
          />
        </label>
      </div>
      <button onClick={() => onDeleteNote(note.id)}>Löschen</button>
    </li>
  );
}

export default NoteItem;