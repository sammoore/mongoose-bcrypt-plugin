'use strict';

const { assign } = Object;

const assert = require('assert');
const bcrypt = require('./lib/bcrypt');
const mongoose = require('mongoose');

module.exports = bcryptPlugin;
bcryptPlugin.Error = class BcryptPluginError extends Error {};

function bcryptPlugin(key, rounds = 8) {
  assert.ok(key, 'key required');
  assert.ok(typeof key == 'string', 'key must be a string');
  assert.ok(key.length > 0, 'key.length must be > 0');

  assert.ok(rounds, 'rounds required');
  assert.ok(typeof rounds == 'number', 'rounds must be a number');
  assert.ok(rounds > 0, 'rounds must be > 0');

  // used to add '.compareCapitalizedKey()' to model instances
  const capitalizedKey = `${key.charAt(0).toUpperCase()}${key.slice(1)}`;

  return function plugin(schema, options) {
    // expose error type on schema and Model
    schema.BcryptPluginError = bcryptPlugin.Error;
    schema.statics.BcryptPluginError = bcryptPlugin.Error;

    schema.add({
      [key]: assign({ type: String }, options)
    });

    schema.pre('save', function (next) {
      if (!this.isModified(key)) {
        return next();
      }

      genHash(this[key], rounds)
      .then((hash) => {
        this[key] = hash;
        next();
      })
      .catch((err) => {
        next(err);
      });
    });

    schema.methods[`compare${capitalizedKey}`] = function (text) {
      return compareHash(text, this[key]);
    };
  };
}

// some bcrypt implementations always throw an error (on failure); so do we.
function compareHash(text, hash) {
  return bcrypt.compare(text, hash)
  .then((success) => {
    if (!success) throw new Error();
    return success;
  })
  .catch((err) => {
    throw new bcryptPlugin.Error();
  });
}

function genHash(text, rounds) {
  return bcrypt.genSalt(rounds).then((salt) => {
    return bcrypt.hash(text, salt);
  });
}
