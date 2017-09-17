import { Borrow, StringSlice } from "../../src/index";
import { assert } from "chai";

describe("StringSlice", () => {
    let subject: StringSlice;

    beforeEach(function () {
        subject = new StringSlice(new Borrow("abcdefghi"));
    });

    describe("length", () => {
        it("should be zero", () => {
            assert.equal(new StringSlice(new Borrow("")).length, 0);
        });

        it("should be positive", () => {
            assert.equal(subject.length, 9);
        });
    });

    describe("offset", () => {
        it("should be zero", () => {
            assert.equal(subject.offset, 0);
        })
    });
});
