import { Borrow, StringSlice } from "../../src/index";
import { assert } from "chai";

describe("StringSlice", () => {
    let subject: StringSlice;

    beforeEach(function () {
        subject = new StringSlice(new Borrow("abcdefghi"));
    });

    describe("length", () => {
        it("should be zero", () => {
            assert.strictEqual(new StringSlice(new Borrow("")).length, 0);
        });

        it("should be positive", () => {
            assert.strictEqual(subject.length, 9);
        });
    });

    describe("offset", () => {
        it("should be zero", () => {
            assert.strictEqual(subject.offset, 0);
        })
    });

    describe("splits at", () => {
        it("should fail when next offset is lower than the current one", () => {
            assert.throws(() => subject.splitsAt(3).splitsAt(1));
        });

        it("should fail when next offset is larger than the size of the string", () => {
            assert.throws(() => subject.splitsAt(42));
        });

        it("should not copy the borrowed data", () => {
            assert.strictEqual(subject.value, subject.splitsAt(3).value);
        });

        it("should have the next offset as the current offset", () => {
            assert.strictEqual(subject.splitsAt(3).offset, 3);
        });

        it("should have the same length", () => {
            assert.strictEqual(subject.splitsAt(3).length, subject.length);
        });
    });

    describe("starts with", () => {
        it("should fail when left operand is empty", () => {
            assert(!new StringSlice(new Borrow("")).startsWith("abc"));
        });

        it("should fail when right operand is empty", () => {
            assert(!subject.startsWith(""));
        });
    });
});
