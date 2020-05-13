const functions = require("firebase-functions");
const { db } = require("./utils/admin");
const app = require("express")();

const FBAuth = require("./utils/fb-auth");

const Screams = require("./handlers/screams");
const Users = require("./handlers/users");

// Screams
app.get("/screams", Screams.list);
app.post("/screams", FBAuth, Screams.create);
app.get("/screams/:screamId", Screams.getOne);
app.delete("/screams/:screamId", FBAuth, Screams.remove);

// Comments
app.post("/screams/:screamId/comments", FBAuth, Screams.createComment);

// Likes
app.put("/screams/:screamId/like", FBAuth, Screams.likeScream);
app.put("/screams/:screamId/unlike", FBAuth, Screams.unlikeScream);

// Users
app.post("/signup", Users.signup);
app.post("/login", Users.login);
app.post("/users/image", FBAuth, Users.uploadImage);
app.post("/users", FBAuth, Users.addUserDetails);
app.get("/users", FBAuth, Users.retriveAuthenticatedUser);
app.get("/users/:handle", Users.retriveHandleDetails);

// Notifications
app.post("/notifications/:handle", FBAuth, Users.markNotifications);

exports.api = functions.region("us-central1").https.onRequest(app);

// Triggers
exports.createNotificationOnLike = functions
  .region("us-central1")
  .firestore.document("likes/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "like",
            read: false,
            screamId: doc.id,
          });
        }
      })
      .catch((err) => console.error(err));
  });
exports.deleteNotificationOnUnLike = functions
  .region("us-central1")
  .firestore.document("likes/{id}")
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch((err) => {
        console.error(err);
        return;
      });
  });
exports.createNotificationOnComment = functions
  .region("us-central1")
  .firestore.document("comments/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "comment",
            read: false,
            screamId: doc.id,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });

exports.onUserImageChange = functions
  .region("us-central1")
  .firestore.document("/user/{userId}")
  .onUpdate((change) => {
    const before = change.before.data();
    const after = change.after.data();

    if (before.imageUrl == after.imageUrl) return;

    const batch = db.batch();

    return db
      .collection("screams")
      .where("userHandle", "==", before.handle)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          const scream = db.doc(`/screams/${doc.id}`);
          batch.update(scream, { userImage: after.imageUrl });
        });
        return batch.commit();
      });
  });

exports.onScreamDelete = functions
  .region("us-central1")
  .firestore.document("/screams/{screamId}")
  .onDelete((snapshot, context) => {
    const screamId = context.params.screamId;
    const batch = db.batch();
    return db
      .collection("comments")
      .where("screamId", "==", screamId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db.collection("likes").where("screamId", "==", screamId).get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db
          .collection("notifications")
          .where("screamId", "==", screamId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch((err) => console.error(err));
  });
