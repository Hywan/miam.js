import { Borrow, StringSlice, tag, concat } from "../../src/index";
import { assert } from "chai";

describe("Parser: concat", () => {
    let input: StringSlice;

    beforeEach(function () {
        input = new StringSlice(new Borrow("abcdefghi"));
    });

    describe("parse", () => {
        it("should consume `abc` and `def`", () => {
            const abcdef = concat(tag("abc"), tag("def"));

            assert.deepEqual(
                abcdef(input),
                {
                    kind: "done",
                    input: input.splitsAt(6),
                    output: "def"
                }
            );
        });

        it("should consume `abc`, `def` and `ghi`", () => {
            const abcdefghi = concat(tag("abc"), tag("def"), tag("ghi"));

            assert.deepEqual(
                abcdefghi(input),
                {
                    kind: "done",
                    input: input.splitsAt(9),
                    output: "ghi"
                }
            );
        });

        it("should consume `abc` but should fail to consume `xyz`", () => {
            const abcxyz = concat(tag("abc"), tag("xyz"));

            assert.deepEqual(
                abcxyz(input),
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
