import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {db} from ".";

export const helloWorld = functions.https.onRequest(
  {cors: true},
  async (req, res) => {
    switch (req.method) {
    case "GET":
      res.status(200).send("Hello ICHack!");
      break;

    case "POST": {
      await db
        .collection("meta")
        .doc("counters")
        .set(
          {
            helloWorldCounter: admin.firestore.FieldValue.increment(1),
          },
          {merge: true}
        );
      const val = await db
        .collection("meta")
        .doc("counters")
        .get();
      res.status(200).json({helloWorldCounter: val.get("helloWorldCounter")});
      break;
    }

    case "DELETE":
      await db
        .collection("meta")
        .doc("counters")
        .set(
          {
            helloWorldCounter: 0,
          },
          {merge: true}
        );
      res.status(204);
      break;

    default:
      res.status(404).send("Method Not Allowed");
    }
  }
);
