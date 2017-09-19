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

function concat(parser1: Parser<string>, parser2: Parser<string>, ...parsers: Parser<string>[]): Parser<string> {
    return (input: Input): Result<string> => {
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

function alt(parser1: Parser<string>, parser2: Parser<string>, ...parsers: Parser<string>[]): Parser<string> {
    return (input: Input): Result<string> => {
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

function opt(parser: Parser<string>): Parser<Option<string>> {
    return (input: Input): Result<Option<string>> => {
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
                    output: new Option(null)
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

function map<T>(parser: Parser<string>, fn: MapFn<string, T>): Parser<T> {
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

interface LabelOutputs {
    [label: string]: any;
}

interface LabelsFn<T> {
    (labels: LabelOutputs): T
}

function label_do<T>(labels: Labels<any>, fn: LabelsFn<T>): Parser<T> {
    return (input: Input): Result<T> => {
        let result;
        let labelledValues: LabelOutputs = {};

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


export {
    tag,
    concat,
    alt,
    opt,
    regex,
    map,
    label_do
};
