const express = require('express');
const cors = require('cors')
const app = express()
app.use(express.json())

app.use(cors())
//routers
const apiRouter = require('./routers/api.router');
const { welcomeMessage } = require('./controllers/welcome.controller');

app.use("/", welcomeMessage)
app.use("/api", apiRouter)


//error handling
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
    if (err.code == "22P02" || err.code == "23503" || err.code == "23502") {
        res.status(400)
        res.send({ msg: "Bad Request" })
    } else {
        next(err)
    }
})
app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;