import {Input, Parser, Result} from "./internal";

export function tag(tag: string): Parser<string> {
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

export function concat(parser1: Parser<string>, parser2: Parser<string>, ...parsers: Parser<string>[]): Parser<string> {
    return (input: Input): Result<string> => {
        let result = parser1(input);
        let parserI;

        parsers.unshift(parser2);

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
