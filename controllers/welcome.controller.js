
exports.welcomeMessage = (req, res) => {
    res.statusCode = 200;
    res.send({ msg: "Welcome to the API" });
};