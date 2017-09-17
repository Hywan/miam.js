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

export function concat(parser1: Parser<string>, parser2: Parser<string>): Parser<string> {
    return (input: Input): Result<string> => {
        const result = parser1(input);

        switch (result.kind) {
            case "done":
                return parser2(result.input);

            case "error":
                return result;
        }
    };
}
