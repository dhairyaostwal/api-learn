const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true, useUnifiedTopology: true });

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

///////// Requests Targeting All Articles /////////

app.route("/articles")
    .get(function (req, res) {
        Article.find(function (err, findArticles) {
            if (!err) {
                console.log("Found Articles\n\n")
                res.send(findArticles) // if no errors then it sends found articles
            }
            else {
                res.send(err) // if errors are there then it'll send errors
            }
        })
    })
    .post(function (req, res) {
        // console.log(">> New post in the db")

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        })
        newArticle.save(function (err) { // sending a callback that no errors 
            if (!err) {
                res.send("New post request in the db!");
            } else {
                res.send(err);
            }
        })
    })
    .delete(function (req, res) {
        Article.deleteMany(function (err) {
            if (!err) {
                res.send("Successfully deleted all articles!")
            } else {
                res.send(err);
            }
        })
    })

///////// Requests Targeting A Specific Articles /////////

app.route("/articles/:articleTitle")

    .get(function (req, res) {

        Article.findOne({ title: req.params.articleTitle }, function (err, foundArticle) {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No article matching the title found.");
            }
        })
    })

    // put replaces the entire data
    .put(function (req, res) {
        Article.updateOne({ title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            function (err, results) {
                if (!err) {
                    res.send("Successfully Updated!");
                } else {
                    res.send(err);
                }
            }
        )
    })

    // replaces a particular detail
    .patch(function (req, res) {
        Article.updateOne({ title: req.params.articleTitle },
            { $set: req.body },
            function (err) {
                if (!err) {
                    res.send("Successfully Updated!");
                } else {
                    res.send(err);
                }
            }
        )
    })

    .delete(function (req, res) {
        Article.deleteOne({ title: req.params.articleTitle }, function (err) {
            if (!err) {
                res.send("Successfully deleted the article!")
            } else {
                res.send(err);
            }
        })
    })




app.listen(3000, function () {
    console.log("Server started on port 3000");
});
