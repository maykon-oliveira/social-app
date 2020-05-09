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

module.exports = {
  list,
  create,
};
