'use strict';
const { expect } = require('chai');
const compile = require('../.');

const testStructure = (structure, passes, fails) => specify(structure, function () {
	const schema = compile(structure);
	for (const value of passes) expect(schema(value)).to.be.true;
	for (const value of fails) expect(schema(value)).to.be.false;
});

describe('structures', function () {
	testStructure('{}', [{}, { foo: 'abc', bar: 123 }, { foo: null }], [[], null]);
	testStructure('[]', [[], ['abc', 123], [null]], [{}, { length: 0 }, null]);
	testStructure('{any}', [{}, { foo: 'abc', bar: 123 }, { foo: null }], [null]);
	testStructure('[any]', [[], ['abc', 123], [null]], [null]);
	testStructure('{string}', [{}, { 123: 'abc' }], [{ 123: 'abc', foo: 123 }, null]);
	testStructure('[string]', [[], ['abc']], [['abc', 123], null]);
	testStructure('{/foo/}', [{}, { abc: 'afooz' }], [{ abc: 'foO' }, null]);
	testStructure('[--integer]', [[], [-2]], [[0], null]);
	testStructure('[[{}]]', [[], [[{ a: -1 }]], [[{}]], [[]], [[{ a: 0 }]]], [[-1], [[-1]], null]);
	testStructure('{{[/foo/]}}', [{}, { a: { b: ['afooz'] } }, { a: { b: [] } }, { a: {} }], [{ a: 'foo' }, { a: { b: 'afooz' } }, { a: { b: ['foO'] } }, null]);
	testStructure('[[{--integer}]]', [[], [[{ a: -1, b: -2 }]], [[{}]], [[]]], [[-1], [[-1]], [[{ a: -1, b: 0 }]], null]);
	specify('[invalid structure]', function () {
		expect(() => compile('{')).to.throw(SyntaxError);
		expect(() => compile('}')).to.throw(SyntaxError);
		expect(() => compile('[')).to.throw(SyntaxError);
		expect(() => compile(']')).to.throw(SyntaxError);
		expect(() => compile('{string')).to.throw(SyntaxError);
		expect(() => compile('string}')).to.throw(SyntaxError);
		expect(() => compile('[string')).to.throw(SyntaxError);
		expect(() => compile('string]')).to.throw(SyntaxError);
		expect(() => compile('{string]')).to.throw(SyntaxError);
		expect(() => compile('[string}')).to.throw(SyntaxError);
		expect(() => compile('{ string }')).to.throw(SyntaxError);
		expect(() => compile('[ string ]')).to.throw(SyntaxError);
		expect(() => compile('[string] ')).to.throw(SyntaxError);
		expect(() => compile(' [string]')).to.throw(SyntaxError);
		expect(() => compile('{string} ')).to.throw(SyntaxError);
		expect(() => compile(' {string}')).to.throw(SyntaxError);
		expect(() => compile('{{string}')).to.throw(SyntaxError);
		expect(() => compile('{string}}')).to.throw(SyntaxError);
		expect(() => compile('{foo}')).to.throw(SyntaxError);
		expect(() => compile('{[foo]}')).to.throw(SyntaxError);
		expect(() => compile('{ }')).to.throw(SyntaxError);
		expect(() => compile('{[ ]}')).to.throw(SyntaxError);
	});
});
