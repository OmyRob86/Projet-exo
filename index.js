const express = require("express");
const mysql   = require("mysql");
const settings = require("./settings.json");

const sqlConfig = settings.sqlConfig;
const app = express();

app.listen(3000, () => {
    console.log("SERVER STARTED");
});

app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));

app.route("/api/articles/create")
    .get((req, res) => res.status(503).send({ status: "ERROR"}))
    .post((req, res) => {
        const sqlConnection = mysql.createConnection(sqlConfig);
        sqlConnection.query(
            "INSERT INTO node_articles(title, content, author) VALUES (?, ?, ?);",
            [ req.body.title, req.body.content, req.body.author ],
            (error, result) => {
                if (error) {
                    res.status(503).send({ status: "ERROR" });
                } else {
                    console.log(result);
                    res.send({ status: "OK" });
                }
                sqlConnection.end();
            }
        );
    });

app.route("/api/articles/delete")
    .get((req, res) => res.status(503).send({ status: "ERROR"}))
    .post((req, res) => {
        const sqlConnection = mysql.createConnection(sqlConfig);
        sqlConnection.query(
            "DELETE FROM node_articles WHERE id = ?;",
            [ req.body.id ],
            (error, result) => {
                if (error) {
                    console.log(error.code);
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
        "SELECT node_articles.id, title, content, node_users.firstname AS authorFirstname, node_users.lastname AS authorLastname, created_at"
        + "  FROM node_articles"
        + "  LEFT JOIN node_users"
        + "  ON node_articles.author = node_users.id"
        + "  ORDER BY created_at DESC"
        + "  LIMIT 5;",
        (error, result) => {
            if (error) {
                res.status(503).send({ status: "ERROR" });
            } else {
                console.log(result);
                res.send({
                    status: "OK",
                    articles: result,
                });
            }
            sqlConnection.end();
        }
    );
});

app.route("/api/comments/create")
    .get((req, res) => res.status(503).send({ status: "ERROR"}))
    .post((req, res) => {
        const sqlConnection = mysql.createConnection(sqlConfig);

        sqlConnection.query(
            "INSERT INTO node_comments(articles_id, author, content) VALUES (?,?,?);",
            [req.body.articles_id, req.body.author, req.body.content],
            (error, result) => {
                if (error) {
                    res.status(503).send({ status: "ERROR" });
                } else {
                    console.log(result);
                    res.send({ status: "OK" });
                }
                sqlConnection.end();
            }
        );
    });

app.route("/api/comments/delete")
    .get((req, res) => res.status(503).send({ status: "ERROR"}))
    .post((req, res) => {
        const sqlConnection = mysql.createConnection(sqlConfig);

        sqlConnection.query(
            "DELETE FROM node_comments WHERE id = ?",
            [req.body.id],
            (error, result) => {
                if (error) {
                    res.status(503).send({ status: "ERROR" });
                } else {
                    console.log(result);
                    res.send({ status: "OK" });
                }
                sqlConnection.end();
            }
        );
    });

app.get("/api/comments", (req, res) => {
    const sqlConnection = mysql.createConnection(sqlConfig);

    sqlConnection.query(
        "SELECT articles_id, content, node_users.firstname AS authorFirstname, node_users.lastname AS authorLastname, created_at"
        + "  FROM node_comments"
        + "  LEFT JOIN node_users"
        + "  ON node_comments.author = node_users.id"
        + "  WHERE articles_id = ?"
        + "  ORDER BY created_at DESC"
        + "  LIMIT 5;",
        [ req.query.articles_id ],
        (error, result) => {
            if (error) {
                console.log(error.code);
                res.status(503).send({ status: "ERROR" });
            } else {
                console.log(result);
                res.send({
                    status: "OK",
                    comments: result,
                });
            }
            sqlConnection.end();
        }
    );
});