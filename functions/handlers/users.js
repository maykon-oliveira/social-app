const { db } = require("../utils/admin");
const { validateSignupData, validateLoginData } = require("../utils/validations");
const firebase = require("firebase");
const firebaseConfig = require("../utils/config");

firebase.initializeApp(firebaseConfig);

let token, userId;
const signup = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle,
  };

  const { valid, errors } = validateSignupData(newUser);
  if (!valid) return res.status(404).json(errors);

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
};

const login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  const { valid, errors } = validateLoginData(user);
  if (!valid) return res.status(404).json(errors);

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
};
module.exports = {
  signup,
  login,
};
