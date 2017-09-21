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
        if (0 === prefix.length) {
            return false;
        }

        return prefix === this.value.borrowed.substr(this.offset, prefix.length);
    }
}

type Input = StringSlice;

interface Done<T> {
    kind: "done",
    input: Input,
    output: T
}

interface Err {
    kind: "error",
    error: ErrKind
}

type ErrKind =
    ErrKind_Tag
  | ErrKind_Alt
  | ErrKind_Regex
  | ErrKind_Map
  | ErrKind_Fold;

interface ErrKind_Tag { kind: "tag" }
interface ErrKind_Alt { kind: "alt" }
interface ErrKind_Regex { kind: "regex" }
interface ErrKind_Map { kind: "map" }
interface ErrKind_Fold { kind: "fold" }

type Result<T> = Done<T> | Err;

type Nullable<T> = T | null;

interface OptionDefaulter<T> {
    (): T
}

interface OptionMapper<T, S> {
    (value: T): S
}

class Option<T> {
    constructor(private readonly value: Nullable<T> = null) { }

    isSome(): boolean {
        return null !== this.value;
    }

    isNone(): boolean {
        return false === this.isSome();
    }

    unwrapOr<S>(defaultValue: S): Nullable<T> | S {
        if (true === this.isNone()) {
            return defaultValue;
        }

        return <T>this.value;
    }

    unwrapOrElse<S>(defaulter: OptionDefaulter<S>): T | S {
        if (true === this.isNone()) {
            return defaulter();
        }

        return <T>this.value;
    }

    map<S>(mapper: OptionMapper<T, S>): Option<S> {
        if (true === this.isNone()) {
            return new Option();
        }

        return new Option(mapper(<T>this.value));
    }

    mapOr<S>(mapper: OptionMapper<T, S>, defaultValue: S): Option<S> {
        let value;

        if (true === this.isNone()) {
            value = defaultValue;
        } else {
            value = mapper(<T>this.value);
        }

        return new Option(value);
    }

    mapOrElse<S>(mapper: OptionMapper<T, S>, defaulter: OptionDefaulter<S>): Option<S> {
        let value;

        if (true === this.isNone()) {
            value = defaulter();
        } else {
            value = mapper(<T>this.value);
        }

        return new Option(value);
    }

    and<S>(rightOption: Option<S>): Option<S> {
        if (true === this.isNone()) {
            return new Option<S>();
        }

        return rightOption;
    }

    andThen<S>(then: OptionMapper<T, Option<S>>): Option<S> {
        if (true === this.isNone()) {
            return new Option<S>();
        }

        return then(<T>this.value);
    }

    or<S>(rightOption: Option<S>): Option<T> | Option<S> {
        if (true === this.isNone()) {
            return rightOption;
        }

        return this;
    }

    orElse<S>(defaulter: OptionDefaulter<Option<S>>): Option<T> | Option<S> {
        if (true === this.isNone()) {
            return defaulter();
        }

        return this;
    }
}

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
    ErrKind_Alt,
    ErrKind_Regex,
    ErrKind_Map,
    ErrKind_Fold,
    Result,
    Option,
    Parser
};
