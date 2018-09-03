'use strict';
const { expect } = require('chai');
const compile = require('../.');

const testRange = (range, passes, fails) => specify(range, function () {
	const schema = compile(range);
	for (const value of passes) expect(schema(value)).to.be.true;
	for (const value of fails) expect(schema(value)).to.be.false;
});

describe('ranges', function () {
	testRange('120-240', [120, 121, 239, 240], [119, 241, 180.1]);
	testRange('-120-240', [-120, -119, 239, 240], [-121, 241, 1.1]);
	testRange('-240--120', [-120, -121, -239, -240], [-119, -241, -180.1]);
	testRange('120.0-240.0', [120, 121, 239, 240, 180.1], [119, 241]);
	testRange('-120.0-240.0', [-120, -119, 239, 240, 1.1], [-121, 241]);
	testRange('-240.0--120.0', [-120, -121, -239, -240, -180.1], [-119, -241]);
	testRange('0.1-0.11', [0.1, 0.11, 0.105], [0.09, 0.111]);
	testRange('-5.0--5.0', [-5], [-5.1, -4.9]);
	testRange('120->240', [120, 121, 239], [119, 241, 180.1, 240]);
	testRange('-120<-240', [-119, 239, 240], [-120, -121, 241, 1.1]);
	testRange('-240<->-120', [-121, -239], [-240, -120, -119, -241, -180.1]);
	testRange('120.0<-240.0', [120.1, 121, 239, 240, 180.1], [119, 241, 120]);
	testRange('-120.0->240.0', [-120, -119, 239, 239.9, 1.1], [-121, 241, 240]);
	testRange('-240.0<->-120.0', [-120.1, -121, -239, -239.9, -180.1], [-119, -241, -120, -240]);
	testRange('0.1<->0.11', [0.101, 0.109, 0.105], [0.09, 0.111, 0.1, 0.11]);
	testRange('-5.0->-5.0', [], [-5, -5.1, -4.9]);
	testRange('0-123', [-0, 0, 1, 122, 123], [-1, 124, 55.1]);
	testRange('-0-123', [-0, 0, 1, 122, 123], [-1, 124, 55.1]);
	specify('[invalid range]', function () {
		expect(() => compile('-Infinity-Infinity')).to.throw(SyntaxError);
		expect(() => compile('NaN-NaN')).to.throw(SyntaxError);
		expect(() => compile(' 120-240')).to.throw(SyntaxError);
		expect(() => compile('120-240 ')).to.throw(SyntaxError);
		expect(() => compile('120-+240')).to.throw(SyntaxError);
		expect(() => compile('+120-240')).to.throw(SyntaxError);
		expect(() => compile('1e8-1e9')).to.throw(SyntaxError);
		expect(() => compile('1.0e8-1.0e9')).to.throw(SyntaxError);
		expect(() => compile('120-240-360')).to.throw(SyntaxError);
		expect(() => compile('"120"-"240"')).to.throw(SyntaxError);
		expect(() => compile('120<>240')).to.throw(SyntaxError);
		expect(() => compile('120<240')).to.throw(SyntaxError);
		expect(() => compile('120<240')).to.throw(SyntaxError);
		expect(() => compile('0120-0121')).to.throw(SyntaxError);
		expect(() => compile('0120-121')).to.throw(SyntaxError);
		expect(() => compile('120-0121')).to.throw(SyntaxError);
		expect(() => compile('120.10-240.10')).to.throw(SyntaxError);
		expect(() => compile('120.10-240.1')).to.throw(SyntaxError);
		expect(() => compile('120.1-240.10')).to.throw(SyntaxError);
		expect(() => compile('120-240.0')).to.throw(SyntaxError);
		expect(() => compile('120.0-240')).to.throw(SyntaxError);
		expect(() => compile('0-0.0')).to.throw(SyntaxError);
		expect(() => compile('0.0-0')).to.throw(SyntaxError);
		expect(() => compile('0.123-.456')).to.throw(SyntaxError);
		expect(() => compile('.123-0.456')).to.throw(SyntaxError);
		expect(() => compile('.123-.456')).to.throw(SyntaxError);
		expect(() => compile('0x123-0x124')).to.throw(SyntaxError);
		expect(() => compile('.-.')).to.throw(SyntaxError);
		expect(() => compile('-')).to.throw(SyntaxError);
		expect(() => compile('<->')).to.throw(SyntaxError);
	});
});
