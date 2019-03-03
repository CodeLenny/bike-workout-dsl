import test, { Macro } from "ava";
import * as nearley from "nearley";
import * as Plan from "../../../../grammar/Plan";

const Number = nearley.Grammar.fromCompiled(Plan);
Number.start = "Number";

const parsesNumber: Macro<[string, number]> = (t, input, expected) => {
    const parser = new nearley.Parser(Number);
    parser.feed(input);
    t.is(parser.results.length, 1);
    t.is(parser.results[0], expected);
}
parsesNumber.title = (given, input, expected) => `Parses ${given}: "${input}" should be ${expected}`;

test("integers", parsesNumber, "15", 15);
test("negative ints", parsesNumber, "-15", -15);
test("floats", parsesNumber, "15.5", 15.5);
test("decimals", parsesNumber, ".5", 0.5);
test("negative floats", parsesNumber, "-15.5", -15.5);
