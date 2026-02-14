import { useEffect, useState } from 'react';

type Note = {
  id: number;
  title: string;
  content: string;
  created_at: string;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/notes`);
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error('Failed to fetch notes', err);
    } finally {
      setLoading(false);
    }
  };

  const createNote = async () => {
    if (!title) return;

    try {
      await fetch(`${API_BASE}/api/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      setTitle('');
      setContent('');

      // Refresh list after creation
      fetchNotes();
    } catch (err) {
      console.error('Failed to create note', err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h1>Notes</h1>

      <div style={{ marginBottom: '2rem' }}>
        <input
          type='text'
          placeholder='Title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ display: 'block', marginBottom: '0.5rem', width: '100%' }}
        />

        <textarea
          placeholder='Content'
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ display: 'block', marginBottom: '0.5rem', width: '100%' }}
        />

        <button onClick={createNote}>Create Note</button>
      </div>

      {loading ? (
        <p>Loading notes...</p>
      ) : (
        <ul>
          {notes.map((note) => (
            <li key={note.id} style={{ marginBottom: '1rem' }}>
              <strong>{note.title}</strong>
              <p>{note.content}</p>
              <small>{new Date(note.created_at).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
