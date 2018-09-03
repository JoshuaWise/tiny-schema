'use strict';

exports.null = [null];
exports.true = [true];
exports.false = [false];
exports.boolean = [...exports.true, ...exports.false];
exports.number = [-123, -1, 0, 1, 123, -123.1, -1.2, 0, 1.8, 123.9, -0];
exports.string = ['foobar', '', '\0'];
exports.object = [{ foo: 'abc', bar: 123 }, {}, { 0: { 123: 'abc' }, length: 1 }];
exports.array = [[123, 'abc'], []];
exports.integer = exports.number.filter(x => Number.isInteger(x));
exports['+number'] = exports.number.filter(x => x >= 0);
exports['-number'] = exports.number.filter(x => x <= 0);
exports['++number'] = exports.number.filter(x => x > 0);
exports['--number'] = exports.number.filter(x => x < 0);
exports['+integer'] = exports.integer.filter(x => x >= 0);
exports['-integer'] = exports.integer.filter(x => x <= 0);
exports['++integer'] = exports.integer.filter(x => x > 0);
exports['--integer'] = exports.integer.filter(x => x < 0);
exports.any = [].concat(...Object.values(exports));

exports.not = (type) => {
	const exclude = exports[type];
	return exports.any.filter(x => !exclude.includes(x));
};
