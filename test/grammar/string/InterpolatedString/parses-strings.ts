import test from "ava";
import * as nearley from "nearley";
import * as Plan from "../../../../grammar/Plan";

const InterpolatedString = nearley.Grammar.fromCompiled(Plan);
InterpolatedString.start = "InterpolatedString";

test("parses double-quoted text", t => {
    const parser = new nearley.Parser(InterpolatedString);
    parser.feed(`"test"`);
    t.is(parser.results.length, 1);
    t.deepEqual(parser.results[0], [
        {
            type: "text",
            value: "test",
        }
    ]);
});

test("parses escaped variables", t => {
    const parser = new nearley.Parser(InterpolatedString);
    parser.feed(`"\\$foo"`);
    t.is(parser.results.length, 1);
    t.deepEqual(parser.results[0], [
        {
            type: "text",
            value: "\\$foo",
        },
    ]);
});

test("parses single-quoted text", t => {
    const parser = new nearley.Parser(InterpolatedString);
    parser.feed(`'test'`);
    t.is(parser.results.length, 1);
    t.deepEqual(parser.results[0], [
        {
            type: "text",
            value: "test",
        },
    ]);
});

test("parses variables", t => {
    const parser = new nearley.Parser(InterpolatedString);
    parser.feed(`"$foo"`);
    t.is(parser.results.length, 1);
    t.deepEqual(parser.results[0], [
        {
            type: "variable",
            value: "foo",
            line: 1,
            col: 2,
        },
    ]);
});

test("parses text and variables", t => {
    const parser = new nearley.Parser(InterpolatedString);
    parser.feed(`"hello $name, welcome"`);
    t.is(parser.results.length, 1);
    t.deepEqual(parser.results[0], [
        {
            type: "text",
            value: "hello ",
        },
        {
            type: "variable",
            value: "name",
            line: 1,
            col: 8,
        },
        {
            type: "text",
            value: ", welcome",
        },
    ]);
});

// Also tests that you can use equations to add text after a variable without
// whitespace or special characters.
test("parses inline equations", t => {
    const parser = new nearley.Parser(InterpolatedString);
    parser.feed(`"\${$foo}s stuff"`);
    t.is(parser.results.length, 1);
    t.deepEqual(parser.results[0], [
        {
            type: "equation",
            value: {
                type: "variable",
                value: "foo",
                line: 1,
                col: 4,
            },
        },
        {
            type: "text",
            value: "s stuff",
        },
    ]);
});
