'use strict';
const { values } = Object;
const { isArray } = Array;
const { isFinite, isInteger } = Number;
const isObject = x => typeof x === 'object' && x !== null;

exports.anyOf = (fns) => (x) => {
  for (const fn of fns) if (fn(x)) return true;
  return false;
};

exports.nullable = fn => x => x === null || !!fn(x);
exports.arrayOf = fn => x => isArray(x) && x.every(fn);
exports.objectOf = fn => x => isObject(x) && values(x).every(fn);
exports.matches = regexp => x => typeof x === 'string' && regexp.test(x);
exports.equals = value => x => value === x;
exports.inFloatRange = (a, operator, b) => floatRanges.get(operator)(+a, +b);
exports.inIntegerRange = (a, operator, b) => integerRanges.get(operator)(+a, +b);
exports.ofType = ident => types.get(ident);

const floatRanges = new Map([
  ['<->', (a, b) => x => typeof x === 'number' && x > a && x < b],
  ['<-', (a, b) => x => typeof x === 'number' && x > a && x <= b],
  ['->', (a, b) => x => typeof x === 'number' && x >= a && x < b],
  ['-', (a, b) => x => typeof x === 'number' && x >= a && x <= b],
]);

const integerRanges = new Map([
  ['<->', (a, b) => x => isInteger(x) && x > a && x < b],
  ['<-', (a, b) => x => isInteger(x) && x > a && x <= b],
  ['->', (a, b) => x => isInteger(x) && x >= a && x < b],
  ['-', (a, b) => x => isInteger(x) && x >= a && x <= b],
]);

const types = new Map([
  ['any', () => true],
  ['null', x => x === null],
  ['true', x => x === true],
  ['false', x => x === false],
  ['boolean', x => typeof x === 'boolean'],
  ['number', x => typeof x === 'number'],
  ['string', x => typeof x === 'string'],
  ['object', isObject],
  ['array', isArray],
  ['finite', isFinite],
  ['integer', isInteger],
  ['+number', x => typeof x === 'number' && x >= 0],
  ['-number', x => typeof x === 'number' && x <= 0],
  ['++number', x => typeof x === 'number' && x > 0],
  ['--number', x => typeof x === 'number' && x < 0],
  ['+finite', x => isFinite(x) && x >= 0],
  ['-finite', x => isFinite(x) && x <= 0],
  ['++finite', x => isFinite(x) && x > 0],
  ['--finite', x => isFinite(x) && x < 0],
  ['+integer', x => isInteger(x) && x >= 0],
  ['-integer', x => isInteger(x) && x <= 0],
  ['++integer', x => isInteger(x) && x > 0],
  ['--integer', x => isInteger(x) && x < 0],
]);
