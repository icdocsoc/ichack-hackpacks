const API = import.meta.env.VITE_CANONICAL_API_URL;

export async function getPosts(id?: string) {
  const url = id ? `${API}/${id}` : API;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errText}`);
    }
    return res.json();
  } catch (err) {
    throw new Error("Network Error");
  }
}

export async function createPost(text: string) {
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errText}`);
    }
    return res.json();
  } catch (err) {
    throw new Error("Network Error");
  }
}

export async function updatePost(id: string, text: string) {
  const url = `${API}/${id}`;
  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errText}`);
    }
    return res.json();
  } catch (err) {
    throw new Error("Network Error");
  }
}

export async function deletePost(id: string) {
  const url = `${API}/${id}`;
  try {
    const res = await fetch(url, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errText}`);
    }
  } catch (err) {
    throw new Error("Network Error");
  }
}