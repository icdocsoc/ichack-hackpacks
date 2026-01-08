const API = import.meta.env.VITE_PACKED_API_URL;

export async function getPosts() {
  const res = await fetch(API);
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
  const res = await fetch(API, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, text }),
  });
  return res.json();
}

export async function deletePost(id: string) {
  await fetch(API, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
}
