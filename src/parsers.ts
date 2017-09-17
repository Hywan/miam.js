import {Input, Parser, Result} from "./internal";

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

        return result;
    };
}

function regex(regex: RegExp): Parser<string> {
    return (input: Input): Result<string> => {
        const regexWithOffset = new RegExp(
            "^.{" + input.offset + "}" +
            "(" + regex.source + ")"
        );

        let match = regexWithOffset.exec(input.value.borrowed);

        if (match) {
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


export {
    tag,
    concat,
    alt,
    regex
};
