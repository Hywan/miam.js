import { Input, Parser, Result, Option } from "./internal";

function tag(tag: string): Parser<string> {
    return (input: Input): Result<string> => {
        const nextOffset = input.offset + tag.length;

        if (nextOffset > input.length || false === input.startsWith(tag)) {
            return {
                kind: "error",
                error: {
                    kind: "tag"
                }
            };
        }

        return {
            kind: "done",
            input: input.splitsAt(nextOffset),
            output: tag
        };
    };
}

function concat<T>(parser1: Parser<T>, parser2: Parser<T>, ...parsers: Parser<T>[]): Parser<T> {
    return (input: Input): Result<T> => {
        let result = parser1(input);

        parsers.unshift(parser2);

        let parserI;

        while (parserI = parsers.shift()) {
            switch (result.kind) {
                case "done":
                    result = parserI(result.input);

                    break;

                case "error":
                    return result;
            }
        }

        return result;
    };
}

function alt<T>(parser1: Parser<T>, parser2: Parser<T>, ...parsers: Parser<T>[]): Parser<T> {
    return (input: Input): Result<T> => {
        let result;
        parsers.unshift(parser1, parser2);

        for (let parser of parsers) {
            result = parser(input);

            switch (result.kind) {
                case "done":
                    return result;

                case "error":
                    break;
            }
        }

        return {
            kind: "error",
            error: {
                kind: "alt"
            }
        };
    };
}

function opt<T>(parser: Parser<T>): Parser<Option<T>> {
    return (input: Input): Result<Option<T>> => {
        let result = parser(input);

        switch (result.kind) {
            case "done":
                return {
                    kind: "done",
                    input: result.input,
                    output: new Option(result.output)
                };

            case "error":
                return {
                    kind: "done",
                    input: input,
                    output: new Option<T>()
                };
        }
    };
}

function regex(regex: RegExp): Parser<string> {
    return (input: Input): Result<string> => {
        const regexWithOffset = new RegExp(
            "^.{" + input.offset + "}" +
            "(" + regex.source + ")"
        );

        let match = regexWithOffset.exec(input.value.borrowed);

        if (match && 0 < match[0].length) {
            return {
                kind: "done",
                input: input.splitsAt(input.offset + match[1].length),
                output: match[1]
            };
        }

        return {
            kind: "error",
            error: {
                kind: "regex"
            }
        }
    };
}

interface MapFn<S, T> {
    (output: S): T
}

function map<T, S>(parser: Parser<S>, fn: MapFn<S, T>): Parser<T> {
    return (input: Input): Result<T> => {
        let result = parser(input);

        switch (result.kind) {
            case "done":
                return {
                    kind: "done",
                    input: result.input,
                    output: fn(result.output)
                };

        case "error":
            return {
                kind: "error",
                error: {
                    kind: "map"
                }
            };
        }
    };
}

interface Labels<T> {
    [label: string]: Parser<T>;
}

type LabelOutputs<T> = {
    [P in keyof Labels<T>]: any;
}

interface LabelsFn<T, S> {
    (labels: LabelOutputs<S>): T
}

function label_do<T>(labels: Labels<any>, fn: LabelsFn<T, any>): Parser<T> {
    return (input: Input): Result<T> => {
        let result;
        let labelledValues: LabelOutputs<any> = {};

        for (let labelName in labels) {
            let labelParser = labels[labelName];
            result          = labelParser(input);

            switch (result.kind) {
                case "done":
                    labelledValues[labelName] = result.output;
                    input = result.input;

                    break;

                case "error":
                    return result;
            }
        }

        return {
            kind: "done",
            input: input,
            output: fn(labelledValues)
        };
    };
}

function precede<T, S>(prefix: Parser<T>, subject: Parser<S>): Parser<S> {
    return (input: Input): Result<S> => {
        let prefixResult = prefix(input);

        switch (prefixResult.kind) {
            case "done":
                return subject(prefixResult.input);

            case "error":
                return prefixResult;
        }
    };
}

function terminate<T, S>(subject: Parser<T>, suffix: Parser<S>): Parser<T> {
    return (input: Input): Result<T> => {
        let subjectResult = subject(input);

        switch (subjectResult.kind) {
            case "done":
                let suffixResult = suffix(subjectResult.input);

                if ("done" === suffixResult.kind) {
                    return {
                        kind: "done",
                        input: suffixResult.input,
                        output: subjectResult.output
                    };
                }

                return suffixResult;

            case "error":
                return subjectResult;
        }
    };
}

interface Folder<T, S> {
    (accumulator: T, item: S): T
}

function fold_many_m_n<T, S>(m: number, n: number, init: T, folder: Folder<T, S>, parser: Parser<S>): Parser<T> {
    if (m >= n) {
        throw new RangeError("m (" + m + ") must be greater than n (" + n + ").");
    }

    if (m < 0) {
        throw new RangeError("m (" + m + ") must be greater than or equal to 0.");
    }

    return (input: Input): Result<T> => {
        for (let i = 1; i < m; ++i) {
            let result = parser(input);

            switch (result.kind) {
                case "done":
                    input = result.input;

                    break;

                case "error":
                    return result;
            }
        }

        let output = init;

        for (; m <= n; ++m) {
            let result = parser(input);

            switch (result.kind) {
                case "done":
                    input  = result.input;
                    output = folder(output, result.output);

                    break;

                case "error":
                    return {
                        kind: "done",
                        input: input,
                        output: output
                    };
            }
        }

        return {
            kind: "done",
            input: input,
            output: output
        };
    };
}

function fold_many_0<T, S>(init: T, folder: Folder<T, S>, parser: Parser<S>): Parser<T> {
    return fold_many_m_n(0, Infinity, init, folder, parser);
}

function fold_many_1<T, S>(init: T, folder: Folder<T, S>, parser: Parser<S>): Parser<T> {
    return fold_many_m_n(1, Infinity, init, folder, parser);
}

function many_0<T>(parser: Parser<T>): Parser<T[]> {
    return fold_many_0(
        [],
        (accumulator: Array<T>, item: T) => {
            accumulator.push(item);

            return accumulator;
        },
        parser
    );
}

function many_1<T>(parser: Parser<T>): Parser<T[]> {
    return fold_many_0(
        [],
        (accumulator: Array<T>, item: T) => {
            accumulator.push(item);

            return accumulator;
        },
        parser
    );
}


export {
    tag,
    concat,
    alt,
    opt,
    regex,
    map,
    label_do,
    precede,
    terminate,
    fold_many_m_n,
    fold_many_0,
    fold_many_1,
    many_0,
    many_1
};
