import { Borrow, StringSlice, tag } from "../../src/index";
import { assert } from "chai";

describe("Parser: tag", () => {
    let input: StringSlice;

    beforeEach(function () {
        input = new StringSlice(new Borrow("abcdefghi"));
    });

    describe("parse", () => {
        it("should consume `abc`", () => {
            const abc = tag("abc");

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
            const xyz = tag("xyz");

            assert.deepEqual(
                xyz(input),
                {
                    kind: "error",
                    error: {
                        kind: "tag"
                    }
                }
            );
        });

        it("should fail to consume ``", () => {
            const xyz = tag("");

            assert.deepEqual(
                xyz(input),
                {
                    kind: "error",
                    error: {
                        kind: "tag"
                    }
                }
            );
        });

        it("should not overflow", () => {
            const long = tag("abcdefghij");

            assert.deepEqual(
                long(input),
                {
                    kind: "error",
                    error: {
                        kind: "tag"
                    }
                }
            );
        });
    });
});
