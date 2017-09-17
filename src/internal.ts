class Borrow<T> {
    constructor(public readonly value: T) {
    }
}

class StringSlice {
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
