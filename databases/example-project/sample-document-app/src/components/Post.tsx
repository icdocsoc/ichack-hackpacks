import { useEffect, useState } from "react"
import { db, auth } from "../firebase";
import {
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore"
import type { Post } from "../pages/Dashboard"
import { postsRef } from "../pages/Dashboard";

async function updatePost(postId: string, newText: string) {
  if (!auth.currentUser) return

  const ref = doc(postsRef, postId)

  await updateDoc(ref, {
    text: newText,
    updatedAt: serverTimestamp(),
  })
}

async function deletePost(postId: string) {
  if (!auth.currentUser) return
  await deleteDoc(doc(postsRef, postId))
}

export function PostItem({ post }: { post: Post }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(post.text)

  const isOwner = auth.currentUser?.uid === post.authorId

  return (
    <div style={{ marginBottom: "1rem" }}>
      <strong>{post.authorId.slice(0, 6)}</strong>

      {editing ? (
        <>
          <textarea value={value} onChange={e => setValue(e.target.value)} />
          <button
            onClick={() => {
              updatePost(post.id!, value)
              setEditing(false)
            }}
          >
            Save
          </button>
        </>
      ) : (
        <div>{post.text}</div>
      )}

      {isOwner && !editing && (
        <>
          <button onClick={() => setEditing(true)}>Edit</button>
          <button
          onClick={() => deletePost(post.id!)}
          style={{ marginLeft: "0.5rem", color: "red" }}
          >
          Delete
          </button>
        </>
      )}
    </div>
  )
}
