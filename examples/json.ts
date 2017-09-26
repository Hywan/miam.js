import { Borrow, StringSlice, Parser, rule, tag, concat, alt, regex, map, precede, terminate, label_do, many_0 } from "../src/index";

const jString = rule<any>(() =>
    map(regex(/"[^"]+"/), match => match.substr(1, match.length - 2))
);

const jNumber = rule<any>(() =>
    map(regex(/\d+/), match => parseInt(match) || 0)
);

const jPair = rule<any>(() =>
    label_do(
        {
            key: jString,
            value: precede(tag(":"), jValue)
        },
        ({key, value}) => {
            let output: any = {};

            output[key] = value;

            return output;
        }
    )
);

const jObject = rule<any>(() =>
    precede(
        tag("{"),
        terminate(
            label_do(
                {
                    first_pair: jPair,
                    other_pairs: many_0(precede(tag(","), jPair))
                },
                ({first_pair, other_pairs}) => Object.assign(first_pair, ...other_pairs)
            ),
            tag("}")
        )
    )
);                          

const jArray = rule<any>(() =>
    precede(
        tag("["),
        terminate(
            label_do(
                {
                    first_value: jValue,
                    other_values: many_0(precede(tag(","), jValue))
                },
                ({first_value, other_values}) => [first_value, ...other_values]
            ),
            tag("]")
        )
    )
);

const jValue = rule<any>(() =>
    alt(
        map(tag("true"), _ => true),
        map(tag("false"), _ => false),
        map(tag("null"), _ => null),
        jNumber,
        jString,
        jArray,
        jObject
    )
);

const input = (input: string) => {
    return new StringSlice(new Borrow(input));
};

const data = [
    "true",
    "false",
    "null",
    "\"hello\"",
    "42",
    "[1]",
    "[1,2,3]",
    "[true,[1,2],\"false\"]",
    "{\"foo\":7,\"bar\":[4,2]}"
];

data.forEach(
    (datum) => {
        console.log(jValue(input(datum)));
    }
);
