import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {db} from ".";

export const posts = functions.https.onRequest(async (req, res) => {
  const { id, text } = req.body;

  switch (req.method) {
    case "POST": {
      if (!text) {
        res.status(400).send("Missing text");
        return;
      }
      const doc = await db.collection("posts").add({
        text,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      res.status(201).json({ id: doc.id });
      break;
    }

    case "GET": {
        if (id) {
          // If specific ID is requested get just that message
          try {
            const snap = await db.collection("posts").doc(id).get();
            res.json({ id, ...snap.data() });
          } catch (err) {
            res.status(404).json({ error: "not_found"});
          }
        } else {
          // Else get all messages
          const snaps = await db.collection("posts").get();
          res.json(snaps.docs.map(d => ({ id: d.id, ...d.data() })));
        }
      break;
    }

    case "PATCH": {
      if (!text) {
        res.status(400).send("Missing text");
        return;
      }
      if (!id) {
        res.status(400).send("Missing id");
        return;
      }
      try {
        await db.collection("posts").doc(id).update({
          text: text,
        });
        res.json({ ok: true });
      } catch(err) {
        res.status(404).json({ error: "not_found"});
      }
      break;
    }

    case "DELETE": {
      if (!id) {
        res.status(400).send("Missing id");
        return;
      }
      await db.collection("posts").doc(id).delete();
      res.status(204).send();
      break;
    }

    default:
      res.status(400).json({ error: "invalid_action" });
  }
});
