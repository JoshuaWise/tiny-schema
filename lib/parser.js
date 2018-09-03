'use strict';

module.exports = class Parser {
	constructor(source) {
		this.source = source;
		this.index = 0;
		this.captured = '';
	}
	accept({ regex, capture }) {
		regex.lastIndex = this.index;
		const match = this.source.match(regex);
		if (match) {
			this.index += match[0].length;
			this.captured = capture === -1 ? match : match[capture];
			return true;
		}
		return false;
	}
	expect(pattern) {
		if (!this.accept(pattern)) this.error();
	}
	error() {
		throw new SyntaxError('Malformed schema string');
	}
	ended() {
		return this.index === this.source.length;
	}
};