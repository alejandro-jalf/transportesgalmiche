const { inject ,errorHandler } = require("express-custom-error");
inject();

const functions = require('firebase-functions');

const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors({ origin: true }));

app.use("*", (req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    next();
});

const { validateOrigin } = require("./middlewares");
app.use(validateOrigin);

const bodyParse = require("body-parser");

app.use(bodyParse.urlencoded({ extended: true }));
app.use(bodyParse.json());

app.use("*", (req, res, next) => {
    if (typeof req.body === "string") {
        req.body = JSON.parse(req.body);
    }
    next();
})

app.use("/", require("./routers"));

app.use(errorHandler());
app.use("*", (req, res) => {
    res.status(404).json({
        success: false,
        message: "La ruta no existe"
    })
});

exports.api = functions.https.onRequest(app);

exports.makeUpperCase = functions.firestore.document("api/{documentId}")
.onCreate((snap, context) => {
    const original = snap.data.original;

    functions.logger.log("Uppercasing", context.params.documentId, original);

    const uppercase = original.toUpperCase();

    return snap.ref.set({uppercase}, {merge: true})
});
