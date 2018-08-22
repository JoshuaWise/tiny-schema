'use strict';
const pattern = (capture, regex) => ({ regex, capture });

exports.verticalBar = pattern(0, /\|/y);
exports.questionMark = pattern(0, /\?/y);
exports.leftBrace = pattern(0, /{/y);
exports.rightBrace = pattern(0, /}/y);
exports.leftBracket = pattern(0, /\[/y);
exports.rightBracket = pattern(0, /]/y);
exports.stringLiteralSQ = pattern(1, /'((?:[^']|'')*)'/y);
exports.stringLiteralDQ = pattern(1, /"((?:[^"]|"")*)"/y);
exports.stringLiteralBT = pattern(1, /`((?:[^`]|``)*)`/y);
exports.floatRange = pattern(-1, /(-?(?:0|[1-9][0-9]*)\.(?:[0-9]*[1-9]|0))(<->?|->?)(-?(?:0|[1-9][0-9]*)\.(?:[0-9]*[1-9]|0))/y);
exports.integerRange = pattern(-1, /(-?(?:0|[1-9][0-9]*))(<->?|->?)(-?(?:0|[1-9][0-9]*))/y);
exports.floatLiteral = pattern(0, /-?(?:0|[1-9][0-9]*)\.(?:[0-9]*[1-9]|0)/y);
exports.integerLiteral = pattern(0, /-?(?:0|[1-9][0-9]*)/y);
exports.typeName = pattern(0, /(?:\+\+?|--?)?[a-z]+/y);
exports.regexp = pattern(-1, /\/((?:[^\/]|\/\/)*)\/([ium]*)/y);
