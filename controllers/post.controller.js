const PostModel = require("../models/post.model");
const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;
const { promisify } = require("util");
const { uploadErrors } = require("../utils/errors.utils");
const pipeline = promisify(require("stream").pipeline);

module.exports.readPost = (req, res) => {
  PostModel.find((err, docs) => {
    if (!err) res.send(docs);
    else console.log("Error to get data : " + err);
  }).sort({ createAt: -1 }); // com du plus récent au plus ancien
};

module.exports.createPost = async (req, res) => {
  let fileName;

  if (req.file !== null) {
    try {
      if (
        req.file.detectedMimeType !== "image/jpg" &&
        req.file.detectedMimeType !== "image/png" &&
        req.file.detectedMimeType !== "image/jpeg"
      )
        throw Error("Invalid File");

      if (req.file.size > 500000) throw Error("max size");
    } catch (err) {
      const errors = uploadErrors(err);
      return res.status(201).json(errors);
    }

    fileName = req.body.postedId + Date.now() + ".jpg";

    await pipeline(
      req.file.stream,
      fs.createWriteStream(
        `${_dirname}/../client/public/uploads/posts/${fileName}` // on lui passe un chemin pour stocker
      )
    );
  }

  const newPost = new postModel({
    postedId: req.body.posterId,
    message: req.body.message,
    picture: req.file !== null ? "./upload/posts/" + fileName : "",
    video: req.body.video,
    likers: [],
    comments: [],
  });

  try {
    const post = await newPost.save();
    return res.status(201).json(post);
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.updatePost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  const updatedRecord = {
    message: req.body.message,
  };

  PostModel.findByIdAndUpdate(
    req.params.id,
    { $set: updatedRecord },
    { new: true },
    (err, docs) => {
      if (!err) res.send(docs);
      else console.log("Update error : " + err);
    }
  );
};

module.exports.deletePost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  PostModel.findByIdAndRemove(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("Delete error : " + err);
  });
};

module.exports.likePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { likers: req.body.id }, // on transmet l id de la personne qui a liké
      },
      { new: true },
      (err, docs) => {
        if (err) return res.status(400).send(err);
      }
    );
    await UserModel.findByIdAndUpdate(
      req.body.id,
      {
        $AddToSet: { likes: req.params.id }, // on rajoute l id du post
      },
      { new: true },
      (err, docs) => {
        if (!err) res.send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.unlikePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likers: req.body.id }, // on retire le like
      },
      { new: true },
      (err, docs) => {
        if (err) return res.status(400).send(err);
      }
    );
    await UserModel.findByIdAndUpdate(
      req.body.id,
      {
        $pull: { likes: req.params.id },
      },
      { new: true },
      (err, docs) => {
        if (!err) res.send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.commentPost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    // est ce que le parametre est connu
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    return PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            commenterId: req.body.commenterId,
            commenterPseudo: req.body.commenterPseudo,
            text: req.body.text,
            timestamp: new Date().getTime(),
          },
        },
      },
      { new: true },
      (err, docs) => {
        if (!err) return res.send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.editCommentPost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    return PostModel.findById(req.params.id, (err, docs) => {
      const theComment = docs.comments.find(
        (
          comment //trouve le com correspondant au com à éditer
        ) => comment._id.equals(req.body.commentID)
      );
      if (!theComment) return res.status(400).send("Comment not found");
      theComment.text = req.body.text; // on peut editer le text

      return docs.save((err) => {
        if (!err) return res.status(200).send(docs);
        return res.status(500).send(err);
      });
    });
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.deleteCommentPost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    return PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          comments: {
            _id: req.params.commentId, // on retire le comment avec tel id
          },
        },
      },
      { new: true },
      (err, docs) => {
        if (!err) return res.send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};
