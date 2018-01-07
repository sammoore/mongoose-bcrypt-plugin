const assert = require('assert');

// NOTE: `hash` type signature differs on `bcrypt`'s implementation.
// Auto-async'ing breaks optional parameters from the original impl.
const { compare, genSalt, hash } = require('bcrypt-nodejs');

function awaitCompare(data, hashValue, callback) {
  assert(typeof data == 'string');
  assert(typeof hashValue == 'string');
  assert(!callback || typeof callback == 'function');

  const promise = new Promise((resolve, reject) => {
    compare(data, hashValue, (error, success) => {
      console.log('success:', success);
      console.log('error:', error);
      if (error) {
        reject(error);
      } else {
        resolve(success);
      }
    });
  });

  if (callback) {
    promise.then(
      success => callback(null, success),
      error => callback(error)
    );
  }

  return promise;
}

function awaitGenSalt(rounds, callback) {
  assert(!rounds || typeof rounds == 'number');

  const promise = new Promise((resolve, reject) => {
    genSalt(rounds, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });

  if (callback) {
    promise.then(
      salt => callback(null, salt),
      error => callback(error)
    );
  }

  return promise;
}

// FIXME: no parameters are "optional", but *are* "nullable".
function awaitHash(data, salt, progress, callback) {
  assert(typeof data == 'string');

  const promise = new Promise((resolve, reject) => {
    hash(data, salt, progress, (error, hashValue) => {
      if (error) {
        reject(error);
      } else {
        resolve(hashValue);
      }
    });
  });

  if (callback) {
    promise.then(
      hashValue => callback(null, hashValue),
      error => callback(error)
    );
  }

  return promise;
}

module.exports = exports = {
  compare: awaitCompare,
  genSalt: awaitGenSalt,
  hash: awaitHash,
};
