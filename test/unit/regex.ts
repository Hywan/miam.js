import { Borrow, StringSlice, regex } from "../../src/index";
import { assert } from "chai";

describe("Parser: regex", () => {
    let input: StringSlice;

    beforeEach(function () {
        input = new StringSlice(new Borrow("abcdefghi"));
    });

    describe("parse", () => {
        it("should consume `abc`", () => {
            const abc = regex(/abc/);

            assert.deepEqual(
                abc(input),
                {
                    kind: "done",
                    input: input.splitsAt(3),
                    output: "abc"
                }
            );
        });

        it("should fail to consume `xyz`", () => {
            const xyz = regex(/xyz/);

            assert.deepEqual(
                xyz(input),
                {
                    kind: "error",
                    error: {
                        kind: "regex"
                    }
                }
            );
        });

        it("should fail to consume ``", () => {
            const xyz = regex(/.{0}/);

            assert.deepEqual(
                xyz(input),
                {
                    kind: "error",
                    error: {
                        kind: "regex"
                    }
                }
            );
        });

        it("should not overflow", () => {
            const long = regex(/.{10}/);

            assert.deepEqual(
                long(input),
                {
                    kind: "error",
                    error: {
                        kind: "regex"
                    }
                }
            );
        });
    });
});
