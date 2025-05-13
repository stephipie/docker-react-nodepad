import { useState } from 'react';

function NoteInput({ onAddNote }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (title.trim() && content.trim()) {
      onAddNote({ title, content });
      setTitle('');
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Notiz Titel..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        type="text"
        placeholder="Notiz Inhalt..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <button type="submit">Hinzufügen</button>
    </form>
  );
}

export default NoteInput;