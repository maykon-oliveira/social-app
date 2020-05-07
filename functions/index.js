const functions = require("firebase-functions");
const admin = require("firebase-admin");

const express = require("express");
const app = express();

admin.initializeApp();

app.get("/screams", (req, res) => {
  admin
    .firestore()
    .collection("screams")
    .orderBy('createdAt', 'desc')
    .get()
    .then(({ docs }) =>
      res.json(
        docs.map((data) => ({
          screamId: data.id,
          body: data.data().body,
          userHandler: data.data().userHandler,
          createdAt: data.data().createdAt,
        }))
      )
    )
    .catch((e) => console.log(e));
});

app.post("/screams", (req, res) => {
  const newScream = {
    ...req.body,
    createdAt: new Date().toISOString(),
  };

  admin
    .firestore()
    .collection("screams")
    .add(newScream)
    .then(({ id }) => res.json({ m: `Document ${id} successefully` }))
    .catch((e) => {
      res.status(500).json({ error: "Something wrong" });
      console.log(e);
    });
});

exports.api = functions.https.onRequest(app);
