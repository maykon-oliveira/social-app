const functions = require("firebase-functions");
const admin = require("firebase-admin");
const app = require("express")();

admin.initializeApp();

const firebase = require("firebase");
const firebaseConfig = {};

firebase.initializeApp(firebaseConfig);

const db = admin.firestore();

app.get("/screams", (req, res) => {
  db.collection("screams")
    .orderBy("createdAt", "desc")
    .get()
    .then(({ docs }) =>
      res.json(
        docs.map((data) => ({
          screamId: data.id,
          body: data.data().body,
          userHandle: data.data().userHandle,
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

  db.collection("screams")
    .add(newScream)
    .then(({ id }) =>
      res.status(201).json({ m: `Document ${id} successfully` })
    )
    .catch((e) => {
      res.status(500).json({ error: "Something wrong" });
      console.log(e);
    });
});

// Sign up
let token, userId;
app.post("/signup", (req, res) => {
  const newUser = {
    ...req.body,
  };

  db.doc(`/users/${newUser.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res.status(400).json({ handle: "this handle is already taken" });
      }
      return firebase
        .auth()
        .createUserWithEmailAndPassword(newUser.email, newUser.password);
    })
    .then((data) => {
      userId = data.user.uid;
      data.user.getIdToken();
    })
    .then((t) => {
      token = t;
      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId,
      };
      return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(() => res.status(201).json({ token }))
    .catch((e) => {
      console.log(e);
      if (e.code === "auth/email-alread-in-use") {
        return res.status(400).json({ email: "Email already in use" });
      }
      return res.status(500).json({ error: e.code });
    });
});

exports.api = functions.https.onRequest(app);
