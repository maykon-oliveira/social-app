const { admin, db } = require("./admin");

module.exports = (req, res, next) => {
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
