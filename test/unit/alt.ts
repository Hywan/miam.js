import { Borrow, StringSlice, tag, alt } from "../../src/index";
import { assert } from "chai";

describe("Parser: alt", () => {
    let input: StringSlice;

    beforeEach(function () {
        input = new StringSlice(new Borrow("abcdefghi"));
    });

    describe("parse", () => {
        it("should consume `abc` or `def`", () => {
            const abc_or_def = alt(tag("abc"), tag("def"));

            assert.deepEqual(
                abc_or_def(input),
                {
                    kind: "done",
                    input: input.splitsAt(3),
                    output: "abc"
                }
            );
        });

        it("should consume `def` or `abc`", () => {
            const def_or_abc = alt(tag("def"), tag("abc"));

            assert.deepEqual(
                def_or_abc(input),
                {
                    kind: "done",
                    input: input.splitsAt(3),
                    output: "abc"
                }
            );
        });

        it("should fail to consume `xyz`", () => {
            const xyz_or_XYZ = alt(tag("xyz"), tag("XYZ"));

            assert.deepEqual(
                xyz_or_XYZ(input),
                {
                    kind: "error",
                    error: {
                        kind: "alt"
                    }
                }
            );
        });
    });
});
