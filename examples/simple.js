const { Borrow, StringSlice } = require("../dist/internal.js");
const { tag, concat }         = require("../dist/parsers.js");

// Create the input of the parser.
const input = new StringSlice(new Borrow("abcdefghi"));

// Create 3 parsers.
const abc = tag("abc");
const def = tag("def");
const abcdefgh = concat(concat(abc, def), tag("gh"));

// Test them!
console.log(abc(input));
console.log(def(input));
console.log(abcdefgh(input));
