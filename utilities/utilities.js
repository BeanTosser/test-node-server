const bcrypt = require('bcrypt');
const util = require('util');

const saltRounds = 10;
exports.saltRounds = saltRounds;

exports.isObjectEmpty = (objectName) => {
  return Object.keys(objectName).length === 0 && objectName.constructor === Object;
}

exports.generateSecureRandomString = async function(length) {
  const asyncRandomBytes = util.promisify(crypto.randomBytes);
  const randomStringBuffer = await asyncRandomBytes(length);
  return randomStringBuffer.toString();
}

exports.checkPassAgainstHash = async function(password, hash){
  return await bcrypt.compare(password, hash);
}

exports.hashFromString = async function(string, salt){
  console.log("attempting to hash from string: " + string + " with salt: " + salt);
  return await bcrypt.hash(string, salt);
}

exports.testHash = async function(password){
  const hashedPass = await bcrypt.hash(password, saltRounds);
  return await bcrypt.compare(password, hashedPass);
}