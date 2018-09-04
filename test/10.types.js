'use strict';
const { expect } = require('chai');
const compile = require('../.');

const types = {};

types.null = [null];
types.true = [true];
types.false = [false];
types.boolean = [...types.true, ...types.false];
types.number = [-123, -1, 0, 1, 123, -123.1, -1.2, 0, 1.8, 123.9, -0];
types.string = ['foobar', '', '\0'];
types.object = [{ foo: 'abc', bar: 123 }, {}, { 0: { 123: 'abc' }, length: 1 }];
types.array = [[123, 'abc'], []];
types.integer = types.number.filter(x => Number.isInteger(x));
types['+number'] = types.number.filter(x => x >= 0);
types['-number'] = types.number.filter(x => x <= 0);
types['++number'] = types.number.filter(x => x > 0);
types['--number'] = types.number.filter(x => x < 0);
types['+integer'] = types.integer.filter(x => x >= 0);
types['-integer'] = types.integer.filter(x => x <= 0);
types['++integer'] = types.integer.filter(x => x > 0);
types['--integer'] = types.integer.filter(x => x < 0);
types.any = [].concat(...Object.values(types));

const not = (type) => {
	const exclude = types[type];
	return types.any.filter(x => !exclude.includes(x));
};

const testType = (type) => specify(type, function () {
	const schema = compile(type);
	for (const value of types[type]) expect(schema(value)).to.be.true;
	for (const value of not(type)) expect(schema(value)).to.be.false;
});

describe('types', function () {
	testType('any');
	testType('null');
	testType('true');
	testType('false');
	testType('boolean');
	testType('number');
	testType('string');
	testType('object');
	testType('array');
	testType('integer');
	testType('+number');
	testType('-number');
	testType('++number');
	testType('--number');
	testType('+integer');
	testType('-integer');
	testType('++integer');
	testType('--integer');
	specify('[invalid type]', function () {
		expect(() => compile('')).to.throw(SyntaxError);
		expect(() => compile(' ')).to.throw(SyntaxError);
		expect(() => compile('any ')).to.throw(SyntaxError);
		expect(() => compile(' any')).to.throw(SyntaxError);
		expect(() => compile('foo')).to.throw(SyntaxError);
		expect(() => compile('+ number')).to.throw(SyntaxError);
		expect(() => compile('+++number')).to.throw(SyntaxError);
		expect(() => compile('+-number')).to.throw(SyntaxError);
		expect(() => compile('-+number')).to.throw(SyntaxError);
		expect(() => compile('+boolean')).to.throw(SyntaxError);
		expect(() => compile('+string')).to.throw(SyntaxError);
		expect(() => compile('+array')).to.throw(SyntaxError);
		expect(() => compile('+any')).to.throw(SyntaxError);
	});
});
