import { Borrow, StringSlice, tag, map, alt, label_do } from "../../src/index";
import { assert } from "chai";

describe("Parser: label_do", () => {
    let input: StringSlice;

    beforeEach(function () {
        input = new StringSlice(new Borrow("abcdefghi"));
    });

    describe("parse", () => {
        it("should consume `abc` and `def`, label, and distribute them", () => {
            const test = label_do(
                {
                    first: tag("abc"),
                    second: tag("def")
                },
                ({first, second}) => {
                    return {
                        one: second,
                        two: first
                    };
                }
            );

            assert.deepEqual(
                test(input),
                {
                    kind: "done",
                    input: input.splitsAt(6),
                    output: {
                        one: "def",
                        two: "abc"
                    }
                }
            );
        });

        it("should label only one", () => {
            const test = label_do(
                {
                    first: tag("abc")
                },
                ({first}) => first.toUpperCase()
            );

            assert.deepEqual(
                test(input),
                {
                    kind: "done",
                    input: input.splitsAt(3),
                    output: "ABC"
                }
            );
        });

        it("should label nothing", () => {
            const test = label_do(
                {
                    _: tag("abc")
                },
                () => 42
            );

            assert.deepEqual(
                test(input),
                {
                    kind: "done",
                    input: input.splitsAt(3),
                    output: 42
                }
            );
        });

        it("should fail to label", () => {
            const test = label_do(
                {
                    first: tag("abc"),
                    second: tag("xyz")
                },
                () => 42
            );

            assert.deepEqual(
                test(input),
                {
                    kind: "error",
                    error: {
                        kind: "tag"
                    }
                }
            );
        });

        it("should label several parsers", () => {
            const reverseAbc = map(
                tag("abc"),
                abc => abc.split("").reverse().join("")
            );
            const test = label_do(
                {
                    first: reverseAbc,
                    second: alt(tag("xyz"), tag("def"))
                },
                ({first, second}) => {
                    return {
                        one: first,
                        two: second.toUpperCase()
                    };
                }
            );

            assert.deepEqual(
                test(input),
                {
                    kind: "done",
                    input: input.splitsAt(6),
                    output: {
                        one: "cba",
                        two: "DEF"
                    }
                }
            );
        });
    });
});
