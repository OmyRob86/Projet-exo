const mysql = require("mysql");
const sqlConfig = require("../../settings.json").sqlConfig;
const app = require("../app.js");

app.route("/api/login")
    .get((req, res) => res.status(503).send({ status: "ERROR"}))
    .post((req, res) => {
        if (typeof req.body.email !== "string" || req.body.email === "") {
            res.status(503).send({ status: "Error", extra: "Vous devez rentrer un email" });
            return;
        }

        if (typeof req.body.password !== "string" || req.body.password === "") {
            res.status(503).send({ status: "Error", extra: "Vous devez rentrer un mot de passe" });
            return;
        }

        const sqlConnection = mysql.createConnection(sqlConfig);
        sqlConnection.query(
            "SELECT id, firstname, lastname, email FROM node_users WHERE email = ? AND password = ?;",
            [ req.body.email, req.body.password ],
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