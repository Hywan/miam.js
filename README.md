# Miam • JS

`miam.js` is a parser combinator framework written in TypeScript. It
is highly inspired by the
excellent [nom](https://github.com/Geal/nom/) project. A special focus
is brough on the type system to provide as much safety as possible,
and to avoid consuming too much memory. Thus, the goal of `miam.js` is
to provide a safe and relatively fast framework to build parsers.

`miam.js` is written in [TypeScript](https://www.typescriptlang.org/), a language that compiles into JavaScript.

## Features

* **Zero-copy**: The parsers do not copy the string being analysed
  despite the fact that they are all pure,
* **Safe parsing**: We commit to bring as much safety as possible
  regarding the current tooling and languages we have. All means (like
  type system) are used to provide a safe framework to develop new
  parsers,
* **Speed**: No benchmark yet, but we hope that our approach with
  zero-copy will help to be fast.

## Example

```js
const input = new StringSlice(new Borrow("abcdefghi"));

const abc = tag("abc");
const def = tag("def");
const abcdefgh = concat(concat(abc, def), tag("gh"));

console.log(abc(input)); // success
console.log(def(input)); // error
console.log(abcdefgh(input)); // success
```

## Status

Still under development. Please don't use it right now :-).
