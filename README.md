# tiny-schema

It's like `typeof`, but it's a function.

```js
const is = require('tiny-schema');

is('number')(5); // => true
is('number')('hello'); // => false
is('string')('hello'); // => true
is('boolean')(false); // => true
```

But it understands the difference between `object` and `null`.

```js
is('object')({}); // => true
is('object')(null); // => false
is('null')(null); // => true
is('null')({}); // => false
```

And it understands the difference between `object` and `array`.

```js
is('array')([]); // => true
is('array')({}); // => false
is('object')([]); // => false
```

Inspired by [JSON Schema](http://json-schema.org/), it can recognize integers.

```js
is('integer')(5); // => true
is('integer')(5.5); // => false
```

And since it knows integers, why not go further?

```js
// Positive
is('+integer')(-5); // => false
is('+integer')(5); // => true
is('+integer')(0); // => true

// Negative
is('-number')(-5.5); // => true
is('-number')(5.5); // => false
is('-number')(0); // => true
```

And sometimes you might want to exclude those pesky zeros...

```js
// Positive
is('++integer')(5); // => true
is('++integer')(0); // => false

// Negative
is('--integer')(-5); // => true
is('--integer')(0); // => false
```

Validating deep structures could be useful...

```js
is('[integer]')([-5, 0, 5]); // => true
is('{string}')({ a: 'hello', b: 'world' }); // => true
```

Nullable types? Might need those too.

```js
is('[string?]?')(['foo']); // => true
is('[string?]?')([null]); // => true
is('[string?]?')(null); // => true
```

Algebraic data types are *so in* these days.

```js
is('number|string')('hello'); // => true
is('number|string')(-123); // => true
```

Nested algebraic data types within a nullable object? Oh I can validate that with one line of code.

```js
is('{integer|boolean}?')({ a: -123, b: true }); // => true
is('{integer|boolean}?')(null); // => true
```

What if I need to get specific about which strings I accept?

```js
is('/^\\w+$/i')('not a word'); // => false
is('/^\\w+$/i')('word'); // => true
```

What if I need to get specific about which *numbers* I accept?

```js
is('100-200')(150); // => true
is('100-200')(200); // => true
is('100-200')(201); // => false
is('100-200')(150.5); // => false (no fractions in an integer range)
is('100.0-200.0')(150.5); // => true (now it accepts fractions)
```

Enums are nice. Let's use those.

```js
is('"foo"|"bar"|500|false')('foo'); // => true
is('"foo"|"bar"|500|false')('bar'); // => true
is('"foo"|"bar"|500|false')(500); // => true
is('"foo"|"bar"|500|false')(false); // => true
```

Can every single feature mentioned thus far be nested and used in every context? Yes? Oh, great.

```js
is('true|{boolean|"foo"|[/^\w+$/i?]}|500.2-600.8|[[--integer]?]');
```

Jesus, okay I'll stop now.

### Escaping string literals

String literals can be created by using `""`, `''`, or ` `` `. Each form is practically equivalent. The only difference is that each form's respective quote character must be escaped when referred to literally. Escaping is done by using two quotes in direct succession.

```js
is('"The cow said ""moo""."')('The cow said "moo".'); // => true
is('`The cow said "moo".`')('The cow said "moo".'); // => true
```

### Regular expressions

Regular expressions are passed directly to the `RegExp` constructor. To include a literal `/` character in a regular expression, use two forward slashes in direct succession.

```js
is('/^application//json$/i')('application/json'); // => true
```

### Exclusionary ranges

When validating a range of numbers, sometimes it's useful to exclude one or both boundaries. This can be done by using the `<` or `>` character on the boundary that should be excluded.

```js
is('0.0->1.0')(0); // => true
is('0.0->1.0')(0.9999); // => true
is('0.0->1.0')(1); // => false

is('0.0<-1.0')(0); // => false
is('0.0<-1.0')(0.9999); // => true
is('0.0<-1.0')(1); // => true

is('0.0<->1.0')(0); // => false
is('0.0<->1.0')(0.9999); // => true
is('0.0<->1.0')(1); // => false
```

> The `<` and `>` characters don't correspond to "less than" and "greater than". Rather, they depict an arrow, and should be read as "approaches".

### Accepting anything

The `any` type can be used to accept any value.

```js
is('any')(5); // => true
is('any')({}); // => true
is('any')(null); // => true
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

## Installation

```
npm install --save tiny-schema
```
