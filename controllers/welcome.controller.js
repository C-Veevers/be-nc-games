
exports.welcomeMessage = (req, res) => {
    const instruction = require('../endpoints.json')
    res.statusCode = 200;
    res.json(instruction);
};