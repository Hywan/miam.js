import { Borrow, StringSlice, tag, terminate } from "../../src/index";
import { assert } from "chai";

describe("Parser: terminate", () => {
    let input: StringSlice;

    beforeEach(function () {
        input = new StringSlice(new Borrow("abcdefghi"));
    });

    describe("parse", () => {
        it("should consume `abc` if terminates by `def`", () => {
            const abc = terminate(tag("abc"), tag("def"));

            assert.deepEqual(
                abc(input),
                {
                    kind: "done",
                    input: input.splitsAt(6),
                    output: "abc"
                }
            );
        });

        it("should fail to consume `abc` if terminates by `xyz`", () => {
            const abc = terminate(tag("xyz"), tag("def"));

            assert.deepEqual(
                abc(input),
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
