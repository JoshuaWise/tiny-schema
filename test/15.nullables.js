'use strict';
const { expect } = require('chai');
const compile = require('../.');

const testNullable = (nullable, passes, fails) => specify(nullable, function () {
	const schema = compile(nullable);
	for (const value of passes) expect(schema(value)).to.be.true;
	for (const value of fails) expect(schema(value)).to.be.false;
});

describe('nullables', function () {
	testNullable('string?', ['', '123', null], [123, {}]);
	testNullable('number?', [0, 123, null], ['123', {}]);
	testNullable('null?', [null], ['', '123', 123, 0, {}]);
	testNullable('"foo"?', ['foo', null], ['fooo', 'foO', '', 'null', {}]);
	testNullable('1.5?', [1.5, null], [1.6, 0, '1.5', {}]);
	testNullable('200<->205?', [201, 204, null], ['201', 200, 205, {}]);
	testNullable('/foo/i?', ['afoOz', null], ['fo', 'null', {}]);
	testNullable('{}?', [null, {}, { a: 123 }], [[]]);
	testNullable('{[{integer}?]}?', [null, {}, { a: [] }, { a: [{}] }, { a: [{ b: 123 }] }, { a: [null] }], [[], { a: null }, { a: [{ b: null }] }, { a: [{ b: 123.5 }] }]);
	specify('[invalid nullable]', function () {
		expect(() => compile(' string?')).to.throw(SyntaxError);
		expect(() => compile('string? ')).to.throw(SyntaxError);
		expect(() => compile('string ?')).to.throw(SyntaxError);
		expect(() => compile('?string')).to.throw(SyntaxError);
		expect(() => compile('string??')).to.throw(SyntaxError);
		expect(() => compile('200?<->205')).to.throw(SyntaxError);
		expect(() => compile('200.0?<->205.0')).to.throw(SyntaxError);
		expect(() => compile('200.0<->205?.0')).to.throw(SyntaxError);
		expect(() => compile('/foo/?i')).to.throw(SyntaxError);
		expect(() => compile('?')).to.throw(SyntaxError);
		expect(() => compile('??')).to.throw(SyntaxError);
		expect(() => compile(' ?')).to.throw(SyntaxError);
		expect(() => compile('{?}')).to.throw(SyntaxError);
		expect(() => compile('[?]')).to.throw(SyntaxError);
	});
});
