'use strict';
const { expect } = require('chai');
const types = require('../tools/types');
const compile = require('../.');

const testType = (type) => specify(type, function () {
	const schema = compile(type);
	for (const value of types[type]) expect(schema(value)).to.be.true;
	for (const value of types.not(type)) expect(schema(value)).to.be.false;
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
