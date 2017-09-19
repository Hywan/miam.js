import { Borrow, StringSlice, tag, precede } from "../../src/index";
import { assert } from "chai";

describe("Parser: precede", () => {
    let input: StringSlice;

    beforeEach(function () {
        input = new StringSlice(new Borrow("abcdefghi"));
    });

    describe("parse", () => {
        it("should consume `def` preceded by `abc`", () => {
            const def = precede(tag("abc"), tag("def"));

            assert.deepEqual(
                def(input),
                {
                    kind: "done",
                    input: input.splitsAt(6),
                    output: "def"
                }
            );
        });

        it("should fail to consume `def` preceded by `xyz`", () => {
            const def = precede(tag("xyz"), tag("def"));

            assert.deepEqual(
                def(input),
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
