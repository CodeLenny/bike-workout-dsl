import test, { Macro } from "ava";
import * as nearley from "nearley";
import * as Plan from "../../../../grammar/Plan";

const Equation = nearley.Grammar.fromCompiled(Plan);
Equation.start = "Equation";

const parsesTwoSidedOperation: Macro<[string, string]> = (t, symbol, name) => {
    const parser = new nearley.Parser(Equation);
    parser.feed(`(5 ${symbol} 10)`);
    t.is(parser.results.length, 1);
    t.deepEqual(parser.results[0], {
        type: "equation",
        value: {
            type: name,
            line: 1,
            col: 4,
            left: {
                type: "number",
                value: 5,
            },
            right: {
                type: "number",
                value: 10,
            },
        },
    });
};

test("parses text", t => {
    const parser = new nearley.Parser(Equation);
    parser.feed(`"test"`);
    t.is(parser.results.length, 1);
    t.deepEqual(parser.results[0], {
        type: "string",
        value: [
            {
                type: "text",
                value: "test",
            },
        ],
    });
});

test("parses sub-equations", t => {
    const parser = new nearley.Parser(Equation);
    parser.feed(`( "test" )`);
    t.is(parser.results.length, 1);
    t.deepEqual(parser.results[0], {
        type: "equation",
        value: {
            type: "string",
            value: [
                {
                    type: "text",
                    value: "test",
                },
            ],
        },
    });
});

test("parses variables", t => {
    const parser = new nearley.Parser(Equation);
    parser.feed(`$foo`);
    t.is(parser.results.length, 1);
    t.deepEqual(parser.results[0], {
        type: "variable",
        value: "foo",
        line: 1,
        col: 1,
    });
});

test("parses numbers", t => {
    const parser = new nearley.Parser(Equation);
    parser.feed(`5`);
    t.is(parser.results.length, 1);
    t.deepEqual(parser.results[0], {
        type: "number",
        value: 5,
    });
});

test("parses multiplication", parsesTwoSidedOperation, "*", "multiply");
test("parses division", parsesTwoSidedOperation, "/", "divide");
test("parses addition", parsesTwoSidedOperation, "+", "plus");
test("parses subtraction", parsesTwoSidedOperation, "-", "minus");

test("uses parenthesis for order of operations", t => {
    const parser = new nearley.Parser(Equation);
    parser.feed(`(2 * (5 * 10))`);
    t.is(parser.results.length, 1);
    t.deepEqual(parser.results[0], {
        type: "equation",
        value: {
            type: "multiply",
            line: 1,
            col: 4,
            left: {
                type: "number",
                value: 2,
            },
            right: {
                type: "equation",
                value: {
                    type: "multiply",
                    line: 1,
                    col: 9,
                    left: {
                        type: "number",
                        value: 5,
                    },
                    right: {
                        type: "number",
                        value: 10,
                    },
                },
            },
        },
    });
});
