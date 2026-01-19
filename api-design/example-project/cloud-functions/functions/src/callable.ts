import {onCall, HttpsError, CallableRequest} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import {db} from ".";

export const posts = onCall(
  async (request: CallableRequest<{
    action?: string,
    id?: string,
    text?: string,
}>) => {
    const {action, id, text} = request.data;

    switch (action) {
    case "create": {
      if (!text) throw new HttpsError("invalid-argument", "Missing text");
      const doc = await db.collection("posts").add({
        text,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return {id: doc.id};
    }

    case "get":
      if (id) {
        const snap = await db.collection("posts").doc(id).get();
        if (!snap.exists) throw new HttpsError("not-found", "Post not found");
        return {id, ...snap.data()};
      } else {
        const snaps = await db.collection("posts").get();
        return snaps.docs.map((d) => ({id: d.id, ...d.data()}));
      }

    case "update":
      if (!id || !text) {
        throw new HttpsError("invalid-argument", "Missing id or text");
      }
      try {
        await db.collection("posts").doc(id).update({text});
        return {ok: true};
      } catch (err) {
        throw new HttpsError("invalid-argument", "Incorrect id");
      }

    case "delete":
      if (!id) throw new HttpsError("invalid-argument", "Missing id");
      try {
        await db.collection("posts").doc(id).delete();
        return {ok: true};
      } catch (err) {
        throw new HttpsError("invalid-argument", "Incorrect id");
      }

    default:
      throw new HttpsError("invalid-argument", "Invalid action");
    }
  }
);
