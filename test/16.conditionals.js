'use strict';
const { expect } = require('chai');
const compile = require('../.');

const testConditional = (conditional, passes, fails) => specify(conditional, function () {
	const schema = compile(conditional);
	for (const value of passes) expect(schema(value)).to.be.true;
	for (const value of fails) expect(schema(value)).to.be.false;
});

describe('conditionals', function () {
	testConditional('string|number', ['foo', '', 123, 0], [true, null, {}]);
	testConditional('string|null', ['foo', '', null], [true, 123, 0, {}]);
	testConditional('"foo"|"123"|boolean', ['foo', '123', true, false], [123, 'foobar', null, {}]);
	testConditional('"foo"|"123"?|boolean', ['foo', '123', true, false, null], [123, 'foobar', 'null', {}]);
	testConditional('/foo/|false|/bar/', ['afooz', 'abarz', false], ['foO', 'baR', true, null, 'false', {}]);
	testConditional('{string}|{number}', [{}, { a: 'foo' }, { b: 123 }], ['foo', 123, { a: 'foo', b: 123 }, null]);
	testConditional('[0-10|"inf"]|string', [[], [5, 'inf', 10, 'inf'], '', 'foo', 'inf'], [null, 123, [11], [-1], [5.5], ['inF'], [null]]);
	specify('[invalid conditional]', function () {
		expect(() => compile('string | number')).to.throw(SyntaxError);
		expect(() => compile('string |number')).to.throw(SyntaxError);
		expect(() => compile('string| number')).to.throw(SyntaxError);
		expect(() => compile('|string|')).to.throw(SyntaxError);
		expect(() => compile('string|')).to.throw(SyntaxError);
		expect(() => compile('|string')).to.throw(SyntaxError);
		expect(() => compile(' | ')).to.throw(SyntaxError);
		expect(() => compile('|')).to.throw(SyntaxError);
		expect(() => compile('||')).to.throw(SyntaxError);
		expect(() => compile('string||number')).to.throw(SyntaxError);
		expect(() => compile('string| |number')).to.throw(SyntaxError);
		expect(() => compile('string|foo')).to.throw(SyntaxError);
		expect(() => compile('{string|}')).to.throw(SyntaxError);
		expect(() => compile('[string|]')).to.throw(SyntaxError);
		expect(() => compile('{|string}')).to.throw(SyntaxError);
		expect(() => compile('[|string]')).to.throw(SyntaxError);
		expect(() => compile('{string| }')).to.throw(SyntaxError);
		expect(() => compile('[string| ]')).to.throw(SyntaxError);
		expect(() => compile('{ |string}')).to.throw(SyntaxError);
		expect(() => compile('[ |string]')).to.throw(SyntaxError);
	});
});
