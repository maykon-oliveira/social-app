const functions = require("firebase-functions");
const app = require("express")();

const FBAuth = require("./utils/fb-auth");

const Screams = require("./handlers/screams");
const Users = require("./handlers/users");

// Screams
app.get("/screams", Screams.list);
app.post("/screams", FBAuth, Screams.create);

// Users
app.post("/signup", Users.signup);
app.post("/login", Users.login);
app.post("/users/image", FBAuth, Users.uploadImage);

exports.api = functions.region("us-central1").https.onRequest(app);
