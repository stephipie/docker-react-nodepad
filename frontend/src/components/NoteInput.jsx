import { useState } from 'react';

function NoteInput({ onAddNote }) {
  const [text, setText] = useState('');

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (text.trim()) {
      onAddNote(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Neue Notiz hinzufügen..."
        value={text}
        onChange={handleChange}
      />
      <button type="submit">Hinzufügen</button>
    </form>
  );
}

export default NoteInput;