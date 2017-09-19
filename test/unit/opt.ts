import { Borrow, StringSlice, tag, opt, label_do } from "../../src/index";
import { assert } from "chai";

describe("Parser: alt", () => {
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
                    output: {
                        kind: "some",
                        value: "abc"
                    }
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
                    output: {
                        kind: "none"
                    }
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
                    switch (xyz.kind) {
                        case "some":
                            return { first: abc, second: xyz.value };

                        case "none":
                            return { first: abc, second: "foo" };
                    }
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
