import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";

// Not necessary but good for consistency
type PostsRequest = {
  action: "create" | "get" | "update" | "delete"
  id?: string
  text?: string
}

type PostsResponse =
  | { id: string }                 // create
  | { ok: true }                   // update/delete
  | { id: string; text: string }   // get single
  | { id: string; text: string }[] // get all

const postsCallable = httpsCallable<PostsRequest, PostsResponse>(functions, "postCallable");

export async function getPosts(id?: string) {
  try {
    const res = await postsCallable({ action: "get", id });
    return res.data;
  } catch (err: any) {
    throw new Error(err.message || "Network Error");
  }
}

export async function createPost(text: string) {
  try {
    const res = await postsCallable({ action: "create", text });
    return res.data;
  } catch (err: any) {
    throw new Error(err.message || "Network Error");
  }
}

export async function updatePost(id: string, text: string) {
  try {
    const res = await postsCallable({ action: "update", id, text });
    return res.data;
  } catch (err: any) {
    throw new Error(err.message || "Network Error");
  }
}

export async function deletePost(id: string) {
  try {
    const res = await postsCallable({ action: "delete", id });
    return res.data;
  } catch (err: any) {
    throw new Error(err.message || "Network Error");
  }
}
