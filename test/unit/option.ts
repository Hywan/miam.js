import { Option } from "../../src/index";
import { assert } from "chai";

describe("Option", () => {
    describe("isSome", () => {
        it("`foo` is some", () => {
            assert(new Option("foo").isSome());
        });

        it("`null` is not some", () => {
            assert(!new Option(null).isSome());
        });
    });

    describe("isNone", () => {
        it("`foo` is not none", () => {
            assert(!new Option("foo").isNone());
        });

        it("`null` is none", () => {
            assert(new Option(null).isNone());
        });
    });

    describe("unwrapOr", () => {
        it("unwrap some value", () => {
            assert.strictEqual(new Option("foo").unwrapOr(42), "foo");
        });

        it("unwrap none value", () => {
            assert.strictEqual(new Option(null).unwrapOr(42), 42);
        });
    });

    describe("unwrapOrElse", () => {
        it("unwrap some value", () => {
            assert.strictEqual(new Option("foo").unwrapOrElse(() => 42), "foo");
        });

        it("unwrap none value", () => {
            assert.strictEqual(new Option(null).unwrapOrElse(() => 42), 42);
        });
    });

    describe("map", () => {
        const mapper = (value: string) => value.length;

        it("map some value", () => {
            assert.deepEqual(new Option("foo").map(mapper), new Option(3));
        });

        it("map none value", () => {
            assert.deepEqual(new Option<string>(null).map(mapper), new Option<number>(null));
        });
    });

    describe("mapOr", () => {
        const mapper = (value: string) => value.length;

        it("map some value", () => {
            assert.deepEqual(new Option("foo").mapOr(mapper, 42), new Option(3));
        });

        it("map none value", () => {
            assert.deepEqual(new Option<string>(null).mapOr(mapper, 42), new Option(42));
        });
    });

    describe("mapOrElse", () => {
        const mapper    = (value: string) => value.length;
        const defaulter = () => 42;

        it("map some value", () => {
            assert.deepEqual(new Option("foo").mapOrElse(mapper, defaulter), new Option(3));
        });

        it("map none value", () => {
            assert.deepEqual(new Option<string>(null).mapOrElse(mapper, defaulter), new Option(42));
        });
    });

    describe("and", () => {
        it("conjunction with some value", () => {
            assert.deepEqual(new Option("foo").and(new Option("bar")), new Option("bar"));
        });

        it("conjunction with none value", () => {
            assert.deepEqual(new Option<string>(null).and(new Option("bar")), new Option<string>(null));
        });
    });

    describe("andElse", () => {
        const defaulter = (value: string) => new Option(value.length);

        it("conjunction with some value", () => {
            assert.deepEqual(new Option("foo").andThen(defaulter), new Option(3));
        });

        it("conjunction with none value", () => {
            assert.deepEqual(new Option<string>(null).andThen(defaulter), new Option<number>(null));
        });
    });

    describe("or", () => {
        it("disjunction with some value", () => {
            assert.deepEqual(new Option("foo").or(new Option("bar")), new Option("foo"));
        });

        it("disjunction with none value", () => {
            assert.deepEqual(new Option(null).or(new Option("bar")), new Option("bar"));
        });
    });

    describe("orElse", () => {
        const defaulter = () => new Option("bar");

        it("disjunction with some value", () => {
            assert.deepEqual(new Option("foo").orElse(defaulter), new Option("foo"));
        });

        it("disjunction with none value", () => {
            assert.deepEqual(new Option(null).orElse(defaulter), new Option("bar"));
        });
    });
});
