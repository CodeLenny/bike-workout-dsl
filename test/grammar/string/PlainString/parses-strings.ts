import test from "ava";
import * as nearley from "nearley";
import * as Plan from "../../../../grammar/Plan";

const PlainString = nearley.Grammar.fromCompiled(Plan);
PlainString.start = "PlainString";

test("parses double-quoted text", t => {
    const parser = new nearley.Parser(PlainString);
    parser.feed(`"test"`);
    t.is(parser.results.length, 1);
    t.deepEqual(parser.results[0], [
        {
            type: "text",
            value: "test",
        }
    ]);
});

test("parses single-quoted text", t => {
    const parser = new nearley.Parser(PlainString);
    parser.feed(`'test'`);
    t.is(parser.results.length, 1);
    t.deepEqual(parser.results[0], [
        {
            type: "text",
            value: "test",
        },
    ]);
});
