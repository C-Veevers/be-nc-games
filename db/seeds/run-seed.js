const devData = require('../data/development-data/');
const testData = require('../data/test-data')
const seed = require('./seed');
const db = require('..');

const runSeed = () => {
  return seed(devData).then(() => db.end());
};
runSeed();
