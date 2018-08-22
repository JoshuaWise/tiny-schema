'use strict';
const validator = require('./validators');
const pattern = require('./patterns');

const expression = module.exports = (parser) => {
  const branches = [];
  do { branches.push(nullableExpression(parser)); }
  while (parser.accept(pattern.verticalBar))
  return branches.length > 1 ? validator.anyOf(branches) : branches[0];
};

const nullableExpression = (parser) => {
  const subject = primaryExpression(parser);
  if (parser.accept(pattern.questionMark)) return validator.nullable(subject);
  return subject;
};

const primaryExpression = (parser) => {
  if (parser.accept(pattern.leftBrace)) {
    if (parser.accept(pattern.rightBrace)) return validator.ofType('object');
    const subject = expression(parser);
    parser.expect(pattern.rightBrace);
    return validator.objectOf(subject);
  }
  if (parser.accept(pattern.leftBracket)) {
    if (parser.accept(pattern.rightBracket)) return validator.ofType('array');
    const subject = expression(parser);
    parser.expect(pattern.rightBracket);
    return validator.arrayOf(subject);
  }
  if (parser.accept(pattern.stringLiteralSQ)) {
    return validator.equals(flatten(parser.captured.replace(/''/g, '\'')));
  }
  if (parser.accept(pattern.stringLiteralDQ)) {
    return validator.equals(flatten(parser.captured.replace(/""/g, '"')));
  }
  if (parser.accept(pattern.stringLiteralBT)) {
    return validator.equals(flatten(parser.captured.replace(/``/g, '`')));
  }
  if (parser.accept(pattern.floatRange)) {
    return validator.inFloatRange(...parser.captured.slice(1));
  }
  if (parser.accept(pattern.integerRange)) {
    return validator.inIntegerRange(...parser.captured.slice(1));
  }
  if (parser.accept(pattern.floatLiteral)) {
    return validator.equals(+parser.captured);
  }
  if (parser.accept(pattern.integerLiteral)) {
    return validator.equals(+parser.captured);
  }
  if (parser.accept(pattern.typeName)) {
    return validator.ofType(parser.captured) || parser.error();
  }
  if (parser.accept(pattern.regexp)) {
    const [, source, flags] = parser.captured;
    return validator.matches(new RegExp(source.replace(/\/\//g, '/'), flags));
  }
  parser.error();
};

const flatten = (str) => {
  Number(str); // Flatten underlying C++ structure in V8
  return str;
};
