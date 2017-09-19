import { Borrow, StringSlice, Option, tag, opt, label_do } from "../../src/index";
import { assert } from "chai";

describe("Parser: opt", () => {
    let input: StringSlice;

    beforeEach(function () {
        input = new StringSlice(new Borrow("abcdefghi"));
    });

    describe("parse", () => {
        it("should optionally consume `abc` (there is some)", () => {
            const abc = opt(tag("abc"));

            assert.deepEqual(
                abc(input),
                {
                    kind: "done",
                    input: input.splitsAt(3),
                    output: new Option("abc")
                }
            );
        });

        it("should optionally consume `xyz` (there is none)", () => {
            const xyz = opt(tag("xyz"));

            assert.deepEqual(
                xyz(input),
                {
                    kind: "done",
                    input: input,
                    output: new Option<string>()
                }
            );
        });

        it("should label an optional tag", () => {
            const test = label_do(
                {
                    abc: tag("abc"),
                    xyz: opt(tag("xyz"))
                },
                ({abc, xyz}) => {
                    return {
                        first: abc,
                        second: xyz.unwrapOr("foo")
                    };
                }
            );

            assert.deepEqual(
                test(input),
                {
                    kind: "done",
                    input: input.splitsAt(3),
                    output: {
                        first: "abc",
                        second: "foo"
                    }
                }
            );
        });
    });
});
