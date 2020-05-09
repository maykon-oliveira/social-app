const { db } = require("../utils/admin");
const { isEmpty } = require("../utils/validations");

const list = (req, res) => {
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
};

const create = (req, res) => {
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
};

const getOne = (req, res) => {
  let screamData;

  db.doc(`/screams/${req.params.screamId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Scream not found" });
      }
      screamData = doc.data();
      screamData.screamId = doc.id;

      return db
        .collection("comments")
        .orderBy("createdAt", "desc")
        .where("screamId", "==", req.params.screamId)
        .get();
    })
    .then((doc) => {
      const comments = [];
      doc.forEach((c) => {
        comments.push(c.data());
      });
      screamData.comments = comments;
      return res.json(screamData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

const createComment = (req, res) => {
  if (isEmpty(req.body))
    return res.status(400).json({ error: "Must not be empty" });

  const newComment = {
    body: req.body.body,
    screamId: req.params.screamId,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
    createdAt: new Date().toISOString(),
  };

  db.doc(`/screams/${req.params.screamId}`)
    .get()
    .then((doc) => {
      if (!doc.exists)
        return res.status(404).json({ error: "Scream not found" });
      return db.collection("comments").add(newComment);
    })
    .then(() => res.json(newComment))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

module.exports = {
  list,
  create,
  getOne,
  createComment,
};
