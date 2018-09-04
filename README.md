# tiny-schema

An easy-to-use JSON type validator on steroids.

## Installation

```
npm install --save tiny-schema
```

## Usage

It's like `typeof`, but as a function.

```js
const schema = require('tiny-schema');

schema('number')(123); // => true
schema('number')('123'); // => false
schema('string')('123'); // => true
schema('boolean')(false); // => true
```

But it understands the difference between an `object` and `null`.

```js
schema('object')({}); // => true
schema('object')(null); // => false
schema('null')(null); // => true
schema('null')({}); // => false
```

And it understands the difference between an `object` and an `array`.

```js
schema('array')([]); // => true
schema('array')({}); // => false
schema('object')([]); // => false
```

Inspired by [JSON Schema](http://json-schema.org/), it can recognize integers.

```js
schema('integer')(5); // => true
schema('integer')(5.5); // => false
```

And since it knows integers, why not go further?

```js
schema('+integer')(-5); // => false
schema('+integer')(5); // => true
schema('+integer')(0); // => true
schema('-number')(-5.5); // => true
schema('-number')(5.5); // => false
schema('-number')(0); // => true
```

And sometimes you might want to exclude those pesky zeros...

```js
schema('++integer')(5); // => true
schema('++integer')(0); // => false
schema('--integer')(-5); // => true
schema('--integer')(0); // => false
```

Validating deep structures could be useful...

```js
schema('[integer]')([-5, 0, 5]); // => true
schema('{string}')({ foo: 'bar' }); // => true
```

Might as well go crazy with the nesting...

```js
schema('[{[[boolean]]}]')([{ foo: [[true, false], [false], []] }]); // => true
```

Nullable types? Might need those too.

```js
schema('[string?]?')(['foo']); // => true
schema('[string?]?')([null]); // => true
schema('[string?]?')(null); // => true
```

Algebraic data types are *so in* these days.

```js
schema('number|string')('hello'); // => true
schema('number|string')(-123); // => true
```

Nested algebraic data types within a nullable object? Oh I can validate that with one line of code.

```js
schema('{integer|boolean}?')({ a: -123, b: true }); // => true
schema('{integer|boolean}?')(null); // => true
```

What if I need to get specific about which strings I accept?

```js
schema('/^\\w+$/i')('not a word'); // => false
schema('/^\\w+$/i')('word'); // => true
```

Well if I can get specific about strings, I should be able to get specific about numbers too.

```js
schema('100-200')(150); // => true
schema('100-200')(200); // => true
schema('100-200')(201); // => false
schema('100-200')(150.5); // => false (no fractions in an integer range)
schema('100.0-200.0')(150.5); // => true (now it accepts fractions)
```

Enums are nice. Let's use those too.

```js
schema('"foo"|"bar"|500|false')('foo'); // => true
schema('"foo"|"bar"|500|false')('bar'); // => true
schema('"foo"|"bar"|500|false')(500); // => true
schema('"foo"|"bar"|500|false')(false); // => true
```

Can every single feature mentioned thus far be nested and used in every context? Yes? Oh, great.

```js
schema('true|{boolean|"foo"|[/^\w+$/i?]}|500.2-600.8|[[--integer]?]');
```

Jesus, okay I'll stop now.

### Escaping string literals

String literals can be created by using `""`, `''`, or ` `` `. Each form is practically equivalent. The only difference is that each form's respective quote character must be escaped when referred to literally. Escaping is done by using two quotes in direct succession.

```js
schema('"The cow said ""moo""."')('The cow said "moo".'); // => true
schema('`The cow said "moo".`')('The cow said "moo".'); // => true
```

### Regular expressions

Regular expressions are passed directly to the `RegExp` constructor. To include a literal `/` character in a regular expression, use two forward slashes in direct succession.

```js
schema('/^application//json$/i')('application/json'); // => true
```

### Exclusionary ranges

When validating a range of numbers, sometimes it's useful to exclude one or both boundaries. This can be done by using the `<` or `>` character on the boundary that should be excluded.

```js
schema('0.0->1.0')(0); // => true
schema('0.0->1.0')(0.9999); // => true
schema('0.0->1.0')(1); // => false

schema('0.0<-1.0')(0); // => false
schema('0.0<-1.0')(0.9999); // => true
schema('0.0<-1.0')(1); // => true

schema('0.0<->1.0')(0); // => false
schema('0.0<->1.0')(0.9999); // => true
schema('0.0<->1.0')(1); // => false
```

> The `<` and `>` characters don't correspond to "less than" and "greater than". Rather, they depict an arrow, and should be read as "approaches".

### Accepting anything

The `any` type can be used to accept any value.

```js
schema('any')(5); // => true
schema('any')({}); // => true
schema('any')(null); // => true
```

## Limitations

The purpose of `tiny-schema` is to enable powerful JSON validation with minimal code use. Because of its terse syntax, typical validator functions can be created in less than one line of code. However, `tiny-schema` is not a replacement for [JSON Schema](http://json-schema.org/).

Unlike JSON Schema, `tiny-schema` cannot...

- validate each of an object's properties by name
- validate that an object has certain property names
- validate that an object *doesn't* have certain property names
- validate that an object or array has a minimum or maximum number of properties
- use [JSON Pointers](http://json-schema.org/latest/relative-json-pointer.html) to implement [dependent types](https://en.wikipedia.org/wiki/Dependent_type)

`tiny-schema` should be seen as an easy-to-use JSON type checker on steroids—not an all-purpose, fully-featured JSON typing system.
