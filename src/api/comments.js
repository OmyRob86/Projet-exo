const mysql     = require("mysql");
const sqlConfig = require("../../settings.json").sqlConfig;
const app       = require("../app.js");

app.route("/api/comments/create")
    .get((req, res) => res.status(503).send({ status: "ERROR"}))
    .post((req, res) => {
        if (typeof req.body.content !== "string" || req.body.content === "") {
            res.status(503).send({ status: "Error", extra: "Le contenu de l'article est vide" });
            return;
        }
        if (typeof req.body.author !== "string" || req.body.author === "") {
            res.status(503).send({ status: "Error", extra: "L'auteur n'est pas reinsigné"  });
            return;
        }
        if (typeof req.body.articleId !== "string" || req.body.articleId === "") {
            res.status(503).send({ status: "Error", extra: "Vous devez rensigner un article id" });
            return;
        }

        const sqlConnection = mysql.createConnection(sqlConfig);
        sqlConnection.query(
            "INSERT INTO node_comments(articles_id, author, content) VALUES (?,?,?);",
            [req.body.articleId, req.body.author, req.body.content],
            (error, result) => {
                if (error) {
                    res.status(503).send({ status: "ERROR" });
                } else {
                    console.log(result);
                    res.send({ status: "OK", result: {
                        commentId: result.insertId
                    }});
                }
                sqlConnection.end();
            }
        );
    });

app.route("/api/comments/delete")
    .get((req, res) => res.status(503).send({ status: "ERROR" }))
    .post((req, res) => {
        if (typeof req.body.id !== "number" || req.body.id <= 0) {
            res.status(503).send({ status: "Error", extra: "Vous devez rensigner une Id d'un commentaire" });
            return;
        }

        const sqlConnection = mysql.createConnection(sqlConfig);
        sqlConnection.query(
            "DELETE FROM node_comments WHERE id = ?",
            [req.body.id],
            (error, result) => {
                if (error) {
                    res.status(503).send({ status: "ERROR" });
                } else {
                    console.log(result);
                    if (result.affectedRows === 0) {
                        res.status(503).send({ status: "ERROR", extra: "Le commentaire n'est pas" });
                    } else {
                        res.send({ status: "OK", extra: "Le commentaire a été bien supprimé" });
                    }
                }
                sqlConnection.end();
            }
        );
    });

app.get("/api/comments", (req, res) => {
    const sqlConnection = mysql.createConnection(sqlConfig);

    sqlConnection.query(
        "SELECT node_comments.id, articles_id, content, node_users.firstname AS authorFirstname, node_users.lastname AS authorLastname, created_at"
        + "  FROM node_comments"
        + "  LEFT JOIN node_users"
        + "  ON node_comments.author = node_users.id"
        + "  WHERE articles_id = ?"
        + "  ORDER BY created_at DESC"
        + "  LIMIT 5;",
        [req.query.articles_id],
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

app.get("/api/comment", (req, res) => {
    const sqlConnection = mysql.createConnection(sqlConfig);
    sqlConnection.query(
        "SELECT articles_id, content, node_users.firstname AS authorFirstname, node_users.lastname AS authorLastname, created_at"
        + "  FROM node_comments"
        + "  LEFT JOIN node_users"
        + "  ON node_comments.author = node_users.id"
        + "  WHERE articles_id = ?"
        + "  LIMIT 1;",
        [ req.query.articles_id ],
        (error, result) => {
            if (error) {
                console.log(error.code);
                res.status(503).send({ status: "ERROR" });
            } else {
                console.log(result);
                res.send({
                    status: "OK",
                    comments: result[0],
                });
            }
            sqlConnection.end();
        }
    );
});

