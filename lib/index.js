'use strict';
const Parser = require('./parser');
const parse = require('./parse');

module.exports = (schema) => {
  const parser = new Parser(schema);
  const fn = parse(parser);
  if (!parser.ended()) parser.error();
  return newValidator(fn);
};

const newValidator = (fn) => {
  const validator = x => fn(x);
  return validator;
};
