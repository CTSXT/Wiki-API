const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", articleSchema);

app
  .route("/articles")

  .get(function (req, res) {
    Article.find(function (err, found) {
      if (!err) {
        console.log(found);
        res.send(found);
      } else {
        res.send(err);
      }
    });
  })

  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save(function (err) {
      if (!err) {
        res.send("OK");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("No errors");
      } else {
        res.send(err);
      }
    });
  });

app
  .route("/articles/:articleTitle")
  .get(function (req, res) {
    Article.findOne(
      { title: req.params.articleTitle },
      function (err, foundArticle) {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send("No match");
        }
      }
    );
  })
  .put(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      //   { new: true, overwrite: true },
      function (err, docs) {
        if (err) {
          res.send(err);
        } else {
          res.send(docs);
        }
      }
    );
  })
  .patch(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { $set: req.body },
      function (err, docs) {
        if (err) {
          res.send(err);
        } else {
          res.send(docs);
        }
      }
    );
  })
  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle }, function (err) {
      if (err) {
        res.send(err);
      } else {
        res.send("deleted");
      }
    });
  });

app.listen(3000, function () {
  console.log("Server started");
});
