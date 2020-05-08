const functions = require("firebase-functions");
const admin = require("firebase-admin");
const app = require("express")();

admin.initializeApp();

const firebase = require("firebase");
const firebaseConfig = {};

firebase.initializeApp(firebaseConfig);

const db = admin.firestore();

const isEmail = (e) => {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return e && e.match(reg);
};
const isEmpty = (s) => !s && s.trim() === "";

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

const FBAuth = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization && !authorization.startsWith("Bearer ")) {
    console.error("No token found");
    return res.status(403).json({ error: "Unauthorized" });
  }

  const idToken = authorization.split("Bearer ")[1];

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken;
      return db
        .collection("users")
        .where("userId", "==", req.user.uid)
        .limit(1)
        .get();
    })
    .then((data) => {
      req.user.handle = data.docs[0].data().handle;
      return next();
    })
    .catch((err) => {
      console.error("Error while verifying token ", err);
      return res.status(403).json(err);
    });
};

app.post("/screams", FBAuth, (req, res) => {
  if (isEmpty(req.body.body)) {
    return res.status(400).json({ body: "Body must not be empty" });
  }

  const newScream = {
    body: req.body.body,
    userHandle: req.user.handle,
    createdAt: new Date().toISOString(),
  };

  db.collection("screams")
    .add(newScream)
    .then(({ id }) => {
      const resScream = newScream;
      resScream.screamId = id;
      res.json(resScream);
    })
    .catch((err) => {
      res.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
});

// Sign up
let token, userId;
app.post("/signup", (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle,
  };

  const errors = {};

  if (isEmpty(newUser.email)) {
    errors.email = "Must not be empty";
  } else if (!isEmail(newUser.email))
    errors.email = "Must be a valid email address";

  if (isEmpty(newUser.password)) errors.password = "Must not me empty";

  if (newUser.password !== newUser.confirmPassword)
    errors.password = "Password must match";

  if (isEmpty(newUser.handle)) errors.handle = "Must not be empty";

  if (Object.keys(errors).length) return res.status(404).json(errors);

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

// Login
app.post("/login", (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  const errors = {};

  if (isEmpty(user.email)) errors.email = "Must not be empty";
  if (isEmpty(user.password)) errors.password = "Must not me empty";
  if (Object.keys(errors).length) return res.status(404).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(({ user }) => user.getIdToken())
    .then((token) => res.json({ token }))
    .catch((e) => {
      console.log(e);
      if (e.code === "auth/wrong-password") {
        return res
          .status(403)
          .json({ general: "Wrong credentials, please try again" });
      }
      return res.status(500).json({ error: e.code });
    });
});

exports.api = functions.region("us-central1").https.onRequest(app);
