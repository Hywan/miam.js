import { Borrow, StringSlice, tag, fold_many_m_n, fold_many_0, fold_many_1, many_0, many_1 } from "../../src/index";
import { assert } from "chai";

describe("Parser: fold_many_m_n", () => {
    let input: StringSlice;

    beforeEach(function () {
        input = new StringSlice(new Borrow("abcabcabcabcdef"));
    });

    describe("parse", () => {
        it("m = 0, n = 0 will throw an exception", () => {
            assert.throws(() => {
                fold_many_m_n(
                    0,
                    0,
                    [],
                    (accumulator: Array<string>, item: string) => {
                        accumulator.push(item);

                        return accumulator;
                    },
                    tag("abc")
                );
            });
        });

        it("m = 1, n = 0 will throw an exception", () => {
            assert.throws(() => {
                fold_many_m_n(
                    1,
                    0,
                    [],
                    (accumulator: Array<string>, item: string) => {
                        accumulator.push(item);

                        return accumulator;
                    },
                    tag("abc")
                );
            });
        });

        it("should consume `xyz` between 0 and 2 times", () => {
            const many = fold_many_m_n(
                0,
                2,
                [],
                (accumulator: Array<string>, item: string) => {
                    accumulator.push(item);

                    return accumulator;
                },
                tag("def")
            );

            assert.deepEqual(
                many(input),
                {
                    kind: "done",
                    input: input,
                    output: [],
                }
            );
        });

        it("should consume `abc` between 1 and 2 times", () => {
            const many = fold_many_m_n(
                1,
                2,
                [],
                (accumulator: Array<string>, item: string) => {
                    accumulator.push(item);

                    return accumulator;
                },
                tag("abc")
            );

            assert.deepEqual(
                many(input),
                {
                    kind: "done",
                    input: input.splitsAt(6),
                    output: ["abc", "abc"]
                }
            );
        });

        it("should consume `abc` between 2 and 3 times", () => {
            const many = fold_many_m_n(
                2,
                3,
                [],
                (accumulator: Array<string>, item: string) => {
                    accumulator.push(item);

                    return accumulator;
                },
                tag("abc")
            );

            assert.deepEqual(
                many(input),
                {
                    kind: "done",
                    input: input.splitsAt(9),
                    output: ["abc", "abc"]
                }
            );
        });

        it("should consume `abc` between 1 and 3 times", () => {
            const many = fold_many_m_n(
                1,
                3,
                [],
                (accumulator: Array<string>, item: string) => {
                    accumulator.push(item);

                    return accumulator;
                },
                tag("abc")
            );

            assert.deepEqual(
                many(input),
                {
                    kind: "done",
                    input: input.splitsAt(9),
                    output: ["abc", "abc", "abc"]
                }
            );
        });

        it("should consume `abc` between 1 and 7 times", () => {
            const many = fold_many_m_n(
                1,
                7,
                [],
                (accumulator: Array<string>, item: string) => {
                    accumulator.push(item);

                    return accumulator;
                },
                tag("abc")
            );

            assert.deepEqual(
                many(input),
                {
                    kind: "done",
                    input: input.splitsAt(12),
                    output: ["abc", "abc", "abc", "abc"]
                }
            );
        });

        it("should consume `abc` between 1 and Infinity times", () => {
            const many = fold_many_m_n(
                1,
                Infinity,
                [],
                (accumulator: Array<string>, item: string) => {
                    accumulator.push(item);

                    return accumulator;
                },
                tag("abc")
            );

            assert.deepEqual(
                many(input),
                {
                    kind: "done",
                    input: input.splitsAt(12),
                    output: ["abc", "abc", "abc", "abc"]
                }
            );
        });
    });

    describe("parse with fold_many_0 and many_0", () => {
        it("should consume `abc` between 0 and Infinity times", () => {
            const fmany0 = fold_many_0(
                [],
                (accumulator: Array<string>, item: string) => {
                    accumulator.push(item);

                    return accumulator;
                },
                tag("abc")
            );

            const many0 = many_0(tag("abc"));

            assert.deepEqual(fmany0(input), many0(input));
        });
    });

    describe("parse with fold_many_1 and many_1", () => {
        it("should consume `abc` between 1 and Infinity times", () => {
            const fmany1 = fold_many_1(
                [],
                (accumulator: Array<string>, item: string) => {
                    accumulator.push(item);

                    return accumulator;
                },
                tag("abc")
            );

            const many1 = many_1(tag("abc"));

            assert.deepEqual(fmany1(input), many1(input));
        });
    });
});
