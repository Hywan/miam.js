export class Borrow<T> {
    constructor(public readonly value: T) {
    }
}

export class StringSlice {
    public length: number;
    public offset: number;

    constructor(public readonly data: Borrow<string>) {
        this.data   = data;
        this.length = data.value.length;
        this.offset = 0;
    }

    splitsAt(nextOffset: number): StringSlice {
        if (nextOffset <= this.offset) {
            throw new RangeError(
                "Next offset must be greater than the current offset."
            );
        }

        if (nextOffset > this.length) {
            throw new RangeError("Offset is too big.");
        }

        const out = new StringSlice(this.data); // this.data is a reference, not a copy.
        out.offset = nextOffset;

        return out;
    }

    startsWith(prefix: string): boolean {
        return prefix === this.data.value.substr(this.offset, prefix.length);
    }
}

export type Input = StringSlice;

export interface Done<T> {
    kind: "done",
    input: Input;
    output: T
}

export interface Err {
    kind: "error",
    error: ErrorKind
}

export interface ErrorKind_Tag { kind: "tag" }

export type ErrorKind =
    ErrorKind_Tag;

export type Result<T> = Done<T> | Err;

export interface Parser<T> {
    (input: Input): Result<T>;
}
