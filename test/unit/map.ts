import { Borrow, StringSlice, tag, map, alt } from "../../src/index";
import { assert } from "chai";

describe("Parser: map", () => {
    let input: StringSlice;

    beforeEach(function () {
        input = new StringSlice(new Borrow("abcdefghi"));
    });

    describe("parse", () => {
        it("should consume `abc` and return `42`", () => {
            const abc = map(tag("abc"), () => 42);

            assert.deepEqual(
                abc(input),
                {
                    kind: "done",
                    input: input.splitsAt(3),
                    output: 42
                }
            );
        });

        it("should send the consumed value to the mapper", () => {
            const abc = map(tag("abc"), abc => abc.toUpperCase());

            assert.deepEqual(
                abc(input),
                {
                    kind: "done",
                    input: input.splitsAt(3),
                    output: "ABC"
                }
            );
        });

        it("should consume `abc` or `def` and return `42`", () => {
            const abc = map(alt(tag("abc"), tag("def")), () => 42);

            assert.deepEqual(
                abc(input),
                {
                    kind: "done",
                    input: input.splitsAt(3),
                    output: 42
                }
            );
        });

        it("should fail to consume `xyz`", () => {
            const xyz = map(tag("xyz"), () => 42);

            assert.deepEqual(
                xyz(input),
                {
                    kind: "error",
                    error: {
                        kind: "map"
                    }
                }
            );
        });

        it("should fail to consume ``", () => {
            const xyz = map(tag(""), () => 42);

            assert.deepEqual(
                xyz(input),
                {
                    kind: "error",
                    error: {
                        kind: "map"
                    }
                }
            );
        });
    });
});
