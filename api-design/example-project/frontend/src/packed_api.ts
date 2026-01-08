const API = import.meta.env.VITE_PACKED_API_URL;

export async function getPosts() {
  const res = await fetch(API);

  try {
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
  try {
    const res = await fetch(API, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, text }),
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
  try {
    const res = await fetch(API, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errText}`);
    }
  } catch (err) {
    throw new Error("Network Error");
  }
}
