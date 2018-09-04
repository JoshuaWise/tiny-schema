'use strict';
const { expect } = require('chai');
const compile = require('../.');

const testLiteral = (literal, passes, fails) => specify(literal, function () {
	const schema = compile(literal);
	for (const value of passes) expect(schema(value)).to.be.true;
	for (const value of fails) expect(schema(value)).to.be.false;
});

describe('literals', function () {
	testLiteral('120', [120], [-120, 120.1, '120', null]);
	testLiteral('-120', [-120], [120, -120.1, '-120', null]);
	testLiteral('120.1', [120.1], [-120.1, 120, '120.1', null]);
	testLiteral('-120.1', [-120.1], [120.1, -120, '-120.1', null]);
	testLiteral('0', [0, -0], [1, -1, 0.1, -0.1, '0', null]);
	testLiteral('-0', [0, -0], [1, -1, 0.1, -0.1, '-0', null]);
	testLiteral('0.0', [0, -0], [1, -1, 0.1, -0.1, '0.0', null]);
	testLiteral('-0.0', [0, -0], [1, -1, 0.1, -0.1, '-0.0', null]);
	testLiteral('1.0', [1], [-1, 1.1, null]);
	testLiteral('0.1', [0.1], [1, -1, 0.101, -0.1, null]);
	testLiteral('"foo"', ['foo'], ['fooo', 'fo', '', null]);
	testLiteral('`foo`', ['foo'], ['fooo', 'fo', '', null]);
	testLiteral('\'foo\'', ['foo'], ['fooo', 'fo', '', null]);
	testLiteral('""', [''], ['o', '\0', null]);
	testLiteral('``', [''], ['o', '\0', null]);
	testLiteral('\'\'', [''], ['o', '\0', null]);
	testLiteral('"0"', ['0'], [0, '"0"', null]);
	testLiteral('`0`', ['0'], [0, '`0`', null]);
	testLiteral('\'0\'', ['0'], [0, '\'0\'', null]);
	testLiteral('"fo""o"', ['fo"o'], ['foo', 'fo""o', 'fo', '', null]);
	testLiteral('`fo``o`', ['fo`o'], ['foo', 'fo``o', 'fo', '', null]);
	testLiteral('\'fo\'\'o\'', ['fo\'o'], ['foo', 'fo\'\'o', 'fo', '', null]);
	testLiteral('"fo\'``o"', ['fo\'``o'], ['foo', 'fo\'`o', 'fo', '', null]);
	testLiteral('`fo\'""o`', ['fo\'""o'], ['foo', 'fo\'"o', 'fo', '', null]);
	testLiteral('\'fo"``o\'', ['fo"``o'], ['foo', 'fo"`o', 'fo', '', null]);
	testLiteral('"\\x20\\u1234"', ['\\x20\\u1234'], ['\x20\\u1234', '\\x20\u1234', '\x20\u1234', '', null]);
	testLiteral('`\\x20\\u1234`', ['\\x20\\u1234'], ['\x20\\u1234', '\\x20\u1234', '\x20\u1234', '', null]);
	testLiteral('\'\\x20\\u1234\'', ['\\x20\\u1234'], ['\x20\\u1234', '\\x20\u1234', '\x20\u1234', '', null]);
	specify('[invalid literal]', function () {
		expect(() => compile('Infinity')).to.throw(SyntaxError);
		expect(() => compile('-Infinity')).to.throw(SyntaxError);
		expect(() => compile('NaN')).to.throw(SyntaxError);
		expect(() => compile(' 120')).to.throw(SyntaxError);
		expect(() => compile('120 ')).to.throw(SyntaxError);
		expect(() => compile('+120')).to.throw(SyntaxError);
		expect(() => compile('0120')).to.throw(SyntaxError);
		expect(() => compile('120.10')).to.throw(SyntaxError);
		expect(() => compile('+120.0')).to.throw(SyntaxError);
		expect(() => compile('1e4')).to.throw(SyntaxError);
		expect(() => compile('1.0e4')).to.throw(SyntaxError);
		expect(() => compile('.')).to.throw(SyntaxError);
		expect(() => compile('.1')).to.throw(SyntaxError);
		expect(() => compile('0x123')).to.throw(SyntaxError);
		expect(() => compile('"fo"o"')).to.throw(SyntaxError);
		expect(() => compile('`fo`o`')).to.throw(SyntaxError);
		expect(() => compile('\'fo\'o\'')).to.throw(SyntaxError);
		expect(() => compile('"fo"o"bar"')).to.throw(SyntaxError);
		expect(() => compile('`fo`o`bar`')).to.throw(SyntaxError);
		expect(() => compile('\'fo\'o\'bar\'')).to.throw(SyntaxError);
	});
});
