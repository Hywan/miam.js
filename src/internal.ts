class Borrow<T> {
    constructor(public readonly borrowed: T) {
    }
}

class StringSlice {
    public length: number;
    public offset: number;

    constructor(public readonly value: Borrow<string>) {
        this.value  = value;
        this.length = value.borrowed.length;
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

        const out = new StringSlice(this.value); // `this.value` is a reference, not a copy.
        out.offset = nextOffset;

        return out;
    }

    startsWith(prefix: string): boolean {
        return prefix === this.value.borrowed.substr(this.offset, prefix.length);
    }
}

type Input = StringSlice;

interface Done<T> {
    kind: "done",
    input: Input;
    output: T
}

interface Err {
    kind: "error",
    error: ErrKind
}

type ErrKind =
    ErrKind_Tag;

interface ErrKind_Tag { kind: "tag" }

type Result<T> = Done<T> | Err;

interface Parser<T> {
    (input: Input): Result<T>;
}


export {
    Borrow,
    StringSlice,
    Input,
    Done,
    Err,
    ErrKind,
    ErrKind_Tag,
    Result,
    Parser
};
