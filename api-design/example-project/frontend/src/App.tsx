import { useEffect, useState } from "react";
import { getPosts, createPost, updatePost, deletePost } from "./packed_api";

type Post = {
  id: string;
  text: string;
};

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newText, setNewText] = useState("");

  async function refresh() {
    const data = await getPosts();
    setPosts(data);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleCreate() {
    if (!newText) return;
    await createPost(newText);
    setNewText("");
    refresh();
  }

  async function handleUpdate(id: string, text: string) {
    const updated = prompt("Edit message", text);
    if (!updated) return;
    await updatePost(id, updated);
    refresh();
  }

  async function handleDelete(id: string) {
    await deletePost(id);
    refresh();
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Posts</h1>

      <input
        value={newText}
        onChange={e => setNewText(e.target.value)}
        placeholder="New post..."
      />
      <button onClick={handleCreate}>Create</button>

      <ul>
        {posts.map(p => (
          <li key={p.id}>
            {p.text}
            <button onClick={() => handleUpdate(p.id, p.text)}>Edit</button>
            <button onClick={() => handleDelete(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
