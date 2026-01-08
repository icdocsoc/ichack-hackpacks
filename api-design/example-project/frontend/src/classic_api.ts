const API = import.meta.env.VITE_CANONICAL_API_URL;

export async function getPosts(id?: string) {
  const url = id ? `${API}/${id}` : API;
  const res = await fetch(url);
  return res.json();
}

export async function createPost(text: string) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  return res.json();
}

export async function updatePost(id: string, text: string) {
  const url = `${API}/${id}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  return res.json();
}

export async function deletePost(id: string) {
  const url = `${API}/${id}`;
  await fetch(url, {
    method: "DELETE",
  });
}