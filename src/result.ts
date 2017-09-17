interface Done<T> {
    kind: "done",
    input: Input;
    output: T
}

interface Err {
    kind: "error",
    error: ErrorKind
}

interface ErrorKind_Tag { kind: "tag" }

type ErrorKind =
    ErrorKind_Tag;

type Result<T> = Done<T> | Err;

interface Parser<T> {
    (input: Input): Result<T>;
}
