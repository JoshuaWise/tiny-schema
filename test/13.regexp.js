'use strict';
const { expect } = require('chai');
const compile = require('../.');

const testRegexp = (regexp, passes, fails) => specify(regexp, function () {
	const schema = compile(regexp);
	for (const value of passes) expect(schema(value)).to.be.true;
	for (const value of fails) expect(schema(value)).to.be.false;
});

describe('ranges', function () {
	testRegexp('//', ['hello', ''], []);
	testRegexp('/(?:)/', ['hello', ''], []);
	testRegexp('/hello/', ['hello', 'ahellob'], ['h', 'hellO', '']);
	testRegexp('/hello/i', ['hello', 'ahellob', 'hellO'], ['h', '']);
	testRegexp('/hell[oO]/', ['hello', 'ahellob', 'hellO'], ['h', '']);
	testRegexp('/^hell[oO]$/', ['hello', 'hellO'], ['h', 'ahellob', 'foo\nhello', '']);
	testRegexp('/^hello/mi', ['hello', 'foo\nhello', 'hellO'], ['h', 'ahellob', '']);
	testRegexp('/^hel//lo$/i', ['hel/lo', 'hEl/lo'], ['h', 'ahel/lob', 'hel//lo', 'hello', '']);
	testRegexp('/^hel\\wlo$/', ['hel_lo', 'hel5lo'], ['h', 'ahel_lob', 'hel\\wlo', 'hel lo', '']);
	specify('[invalid regexp]', function () {
		expect(() => compile(' /hello/')).to.throw(SyntaxError);
		expect(() => compile('/hello/ ')).to.throw(SyntaxError);
		expect(() => compile(' /hello/i')).to.throw(SyntaxError);
		expect(() => compile('/hello/i ')).to.throw(SyntaxError);
		expect(() => compile('/hello/ i')).to.throw(SyntaxError);
		expect(() => compile('/hello/p')).to.throw(SyntaxError);
		expect(() => compile('/hello/ii')).to.throw(SyntaxError);
		expect(() => compile('/hello/g')).to.throw(SyntaxError);
		expect(() => compile('/hel/lo/')).to.throw(SyntaxError);
		expect(() => compile('/hel/l/o/')).to.throw(SyntaxError);
	});
});
