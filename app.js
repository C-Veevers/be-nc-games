const express = require('express');
const app = express()
app.use(express.json())
//controllers:



//error handling:

app.all("*", (req, res) => {
    res.status(404).send({ msg: "Invalid URL" });
});
app.use((err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({ msg: err.msg });
    } else {
        next(err);
    }
});
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: "Internal server error" });
});
