const { Borrow, StringSlice } = require("../dist/internal.js");
const { tag, concat, alt, regex, map } = require("../dist/parsers.js");

// Create the input of the parser.
const input = new StringSlice(new Borrow("abcdefghi"));

// Create 3 parsers.
const abc        = tag("abc");
const def        = tag("def");
const def_or_abc = alt(def, abc);
const abcdefgh   = concat(abc, def, tag("gh"));

// Test them!
console.log(abc(input));
console.log(def(input));
console.log(def_or_abc(input));
console.log(abcdefgh(input));
console.log(concat(tag("abc"), regex(/de[fg]/), tag("ghi"))(input));
console.log(map(tag("abc"), (output) => ["FIRST"])(input));
