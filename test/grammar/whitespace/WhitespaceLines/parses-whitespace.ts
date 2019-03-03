import test from "ava";
import * as nearley from "nearley";
import * as Plan from "../../../../grammar/Plan";

const WhitespaceLines = nearley.Grammar.fromCompiled(Plan);
WhitespaceLines.start = "WhitespaceLines";

test("parses whitespace", t => {
    const parser = new nearley.Parser(WhitespaceLines);
    parser.feed("   ");
    t.is(parser.results.length, 1);
});

test("parses newlines", t => {
    const parser = new nearley.Parser(WhitespaceLines);
    parser.feed("\n\n\n");
    t.is(parser.results.length, 1);
});

test("parses whitespace and newlines", t => {
    const parser = new nearley.Parser(WhitespaceLines);
    parser.feed(" \n \n ");
    t.is(parser.results.length, 1);
});
