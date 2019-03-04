import test from "ava";
import * as nearley from "nearley";
import * as Plan from "../../../../grammar/Plan";

const Whitespace = nearley.Grammar.fromCompiled(Plan);
Whitespace.start = "Whitespace";

test("parses whitespace", t => {
    const parser = new nearley.Parser(Whitespace);
    parser.feed("   ");
    t.is(parser.results.length, 1);
});
