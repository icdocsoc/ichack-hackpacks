import { useEffect, useState } from "react"
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot,
  where,
  writeBatch,
  getDocs,
} from "firebase/firestore"
import type {
  FirestoreDataConverter,
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Query,
  CollectionReference,
  Timestamp,
} from "firebase/firestore"
import { PostItem } from "../components/Post";

export type Post = {
  id?: string
  text: string
  authorId: string
  createdAt?: Timestamp | null
  updatedAt?: Timestamp | null
}

const postConverter: FirestoreDataConverter<Post> = {
  toFirestore(post: Post): DocumentData {
    // Remove the 'id' because Firestore document ID is separate
    return {
      text: post.text,
      authorId: post.authorId,
      createdAt: post.createdAt ?? serverTimestamp(),
      updatedAt: post.updatedAt ?? null,
    }
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Post {
    const data = snapshot.data(options)
    return {
      id: snapshot.id,      // Use Firestore document ID
      text: data.text,
      authorId: data.authorId,
      createdAt: data.createdAt ?? null,
      updatedAt: data.updatedAt ?? null,
    }
  },
}

export const postsRef: CollectionReference<Post> = collection(db, "posts").withConverter(postConverter)
// Get the 50 most recent messages
const q: Query<Post> = query(postsRef, orderBy("createdAt", "desc"), limit(50))

async function deleteAllMyPosts() {
  if (!auth.currentUser) return

  const allMyPostsQ: Query<Post> = query(postsRef, where('authorId', '==', auth.currentUser!.uid))
  const snap = await getDocs(allMyPostsQ)

  if (snap.empty) {
    alert("No messages to delete!")
    return
  }


  if (!confirm(`Are you sure you want to delete all ${snap.size} of your posts?`)) return

  try {
    const batch = writeBatch(db)
    snap.docs.forEach(d => {
      batch.delete(d.ref)
    })
    await batch.commit()
    alert("Success! All your posts have been deleted.")
  } catch (err) {
    console.error(err)
    alert("Failure! Could not delete your posts.")
  }
}

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([])
  const [text, setText] = useState("")

  useEffect(() => {
      const unsubscribe = onSnapshot(q, snapshot => {
        const posts: Post[] = snapshot.docs.map(doc => doc.data())
        setPosts(posts)
      })
  
      return unsubscribe
    }, [])

  async function submitPost() {
    if (!text.trim() || !auth.currentUser) return

    await addDoc(postsRef, {
      text: text,
      authorId: auth.currentUser!.uid,
      createdAt: serverTimestamp(),
      updatedAt: null,
    })

    setText("")
  }

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h2>Very Simple Social Media</h2>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows={3}
        style={{ width: "100%" }}
      />

      <button onClick={submitPost} style={{ marginTop: "0.5rem" }}>Post</button>
      <button onClick={deleteAllMyPosts} style={{ marginTop: "0.5rem", marginLeft: "1rem", backgroundColor: "red", color: "white" }}>
        Delete All My Posts
      </button>

      <hr />

      {posts.map(p => <PostItem key={p.id} post={p} />)}
    </div>
  )
}