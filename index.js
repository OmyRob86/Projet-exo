const express = require("express");
const mysql = require("mysql");
const settings = require("./settings.json");

const sqlConfig = settings.sqlConfig;

const app = express();

app.listen(3000, () => {
    console.log("Server started...");
});

app.use(express.static("./public"));
app.use(express.urlencoded({extended: true}));

app.route("/api/articles/create")
    .get((req, res) => res.status(503).send({status: "error"}))
    .post((req, res) => {
        const sqlConnection = mysql.createConnection(sqlConfig);
        sqlConnection.query(
            "INSERT INTO node_articles(title, content, author) VALUES (NULL, ?, ?, ?)",
            [req.body.title, req.body.content, req.body.author, req.body.created_at],
            (error, result) => {
                if (error) {
                    console.log("error :", error.code);
                    res.status(503).send({status: "error"});
                } else {
                    console.log(result);
                    res.send({status: "OK"});
                }
                sqlConnection.end();
            });    
    });

app.route("/api/articles/delete")
    .get((req, res) => res.status(503).send({ status: "ERROR" }))
    .post((req, res) => {
        const sqlConnection = mysql.createConnection(sqlConfig);
        sqlConnection.query(
            "DELETE FROM node_articles WHERE id = ?",
            [ req.body.id ],
            (error, result) => {
                if (error) {
                    console.log("ERROR :", error.code);
                    res.status(503).send({ status: "ERROR" });
                } else {
                    console.log(result);
                    res.send({ status: "OK" });
                }
                sqlConnection.end();
            }
        );
    });

app.get("/api/articles", (req, res) => {
    const sqlConnection = mysql.createConnection(sqlConfig);
    
    sqlConnection.query(
        "SELECT node_article.id, title, content, users.firstname AS authorFirstname, author.lastname AS users.lastname AS authorLastname, created_at"
        + "  FROM node_articles"
        + "  LEFT JOIN node_users"
        + "  ON node_articles.author = node_users.id"
        + "  ORDER BY created_at DESC"
        + "  LIMIT 5", 
        (error, result) => {
            if (error) {
                console.log("ERROR :", error.code);
            } else {
                res.send({ 
                    status: "OK",
                    articles: result,
                });
            }
            sqlConnection.end();
        }
    );
});

app.get("/api/comments", (req, res) => {
    const sqlConnection = mysql.createConnection(sqlConfig);
    sqlConnection.query(
        "SELECT id, article_id, author, content, created_at FROM node_comments ORDER BY id DESC LIMIT 5",
        (error, result) => {
            if (error) {
                console.log("ERROR :", error.code);
            } else {
                res.send(result);
            }
            sqlConnection.end();
        }
    );
});

app.route("/api/comments/create")
    .get((req, res) => res.status(503).send({ status: "ERROR" }))
    .post((req, res) => {
        console.log(req.body);
        const sqlConnection = mysql.createConnection(sqlConfig);
        sqlConnection.query(
            "INSERT INTO node_comments VALUES (NULL, ?, ?, ?, ?)",
            [req.body.article_id, req.body.author, req.body.content, req.body.created_at],
            (error, result) => {
                if (error) {
                    console.log("ERROR :", error.code);
                    res.status(503).send({ status: "ERROR" });
                } else {
                    console.log(result);
                    res.send({ status: "OK" });
                }
                sqlConnection.end();
            });
    });

app.route("/api/comments/delete")
    .get((req, res) => res.status(503).send({ status: "ERROR" }))
    .post((req, res) => {
        const sqlConnection = mysql.createConnection(sqlConfig);
        sqlConnection.query(
            "DELETE FROM node_comments WHERE id = ?",
            [req.body.commentID],
            (error, result) => {
                if (error) {
                    console.log("ERROR :", error.code);
                    res.status(503).send({ status: "ERROR" });
                } else {
                    console.log(result);
                    res.send({ status: "OK" });
                }
                sqlConnection.end();
            });
    });