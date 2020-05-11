const { db, admin } = require("../utils/admin");
const {
  validateSignupData,
  validateLoginData,
  reduceUserDetails,
} = require("../utils/validations");
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

  const noImg = "no-img.png";

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
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${noImg}?alt=media`,
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

const uploadImage = (req, res) => {
  const Busboy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  let imgFilename;
  let imageToUpload;

  const busboy = new Busboy({ headers: req.headers });
  busboy.on("file", (fieldname, file, filename, enconding, mimetype) => {
    if (mimetype !== "image/jpeg" && mimetype !== "image/png")
      res.status(400).json({ error: "Wrong file type submitted" });

    const imgExt = filename.split(".")[filename.split(".").length - 1];
    imgFilename = `${Math.round(Math.random() * 10000000)}.${imgExt}`;
    const filePath = path.join(os.tmpdir(), imgFilename);
    imageToUpload = { filePath, mimetype };
    file.pipe(fs.createWriteStream(filePath));
  });
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageToUpload.filePath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToUpload.mimetype,
          },
        },
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imgFilename}?alt=media`;
        return db.doc(`/users/${req.user.handle}`).update({
          imageUrl,
        });
      })
      .then(() => res.json({ message: "Image uploaded successfully" }))
      .catch((e) => {
        console.log(e);
        return res.status(500).json({ error: e.code });
      });
  });
  busboy.end(req.rawBody);
};

const addUserDetails = (req, res) => {
  const userDetails = reduceUserDetails(req.body);

  db.doc(`/users/${req.user.handle}`)
    .update(userDetails)
    .then(() => res.json("Details added successfully"))
    .catch((e) => {
      console.log(e);
      return res.status(500).json({ error: e.code });
    });
};

const retriveAuthenticatedUser = (req, res) => {
  const userData = {};
  db.doc(`/users/${req.user.handle}`)
    .get()
    .then((user) => {
      if (user.exists) {
        userData.credentials = user.data();
        return db
          .collection("likes")
          .where("userHandle", "==", req.user.handle)
          .get();
      }
    })
    .then((data) => {
      userData.likes = [];
      data.forEach((doc) => {
        userData.likes.push(doc.data());
      });
      return db
        .collection("notifications")
        .where("recipient", "==", req.user.handle)
        .orderBy("createdAt", "desc")
        .limit(10)
        .get();
    })
    .then((data) => {
      userData.notifications = [];
      data.forEach((doc) => {
        userData.notifications.push({ ...doc.data(), notificationId: doc.id });
      });
      return res.json(userData);
    })
    .catch((e) => {
      console.log(e);
      return res.status(500).json({ error: e.code });
    });
};

const retriveHandleDetails = (req, res) => {
  const userData = {};
  db.doc(`/users/${req.params.handle}`)
    .get()
    .then((user) => {
      if (user.exists) {
        userData.user = user.data();

        return db
          .collection("screams")
          .where("userHandle", "==", req.params.handle)
          .orderBy("createdAt", "desc")
          .get();
      }
      return res.status(404).json({ error: "User not found" });
    })
    .then((data) => {
      userData.screams = [];
      data.forEach((doc) => {
        userData.screams.push({ ...doc.data(), screamId: doc.id });
      });
      return res.json(userData);
    })
    .catch((e) => {
      console.log(e);
      return res.status(500).json({ error: e.code });
    });
};

const markNotifications = (req, res) => {
  const batch = db.batch();

  req.body.forEach((id) => {
    const doc = db.doc(`/notifications/${id}`);
    batch.update(doc, { read: true });
  });
  batch
    .commit()
    .then(() => {
      return res.json({ message: "Notificarions marked as read" });
    })
    .catch((e) => {
      console.error(e);
      return ers.status(500).json({ error: e.code });
    });
};

module.exports = {
  signup,
  login,
  uploadImage,
  addUserDetails,
  retriveAuthenticatedUser,
  retriveHandleDetails,
  markNotifications,
};
