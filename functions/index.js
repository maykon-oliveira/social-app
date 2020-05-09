const functions = require("firebase-functions");
const app = require("express")();

const FBAuth = require("./utils/fb-auth");

const Screams = require("./handlers/screams");
const Users = require("./handlers/users");

// Screams
app.get("/screams", Screams.list);
app.post("/screams", FBAuth, Screams.create);
app.get("/screams/:screamId", Screams.getOne);
app.delete("/screams/:screamId", FBAuth, Screams.remove);
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

exports.api = functions.region("us-central1").https.onRequest(app);
