import anyTest, { Macro, TestInterface } from "ava";
import * as nearley from "nearley";
import * as Strength from "../../../grammar/Strength";

interface Context {
    parser: nearley.Parser,
}

const test = anyTest as TestInterface<Context>;

test.beforeEach(t => {
    t.context.parser = new nearley.Parser(nearley.Grammar.fromCompiled(Strength));
});

const parsesUnits: Macro<[string, string], Context> = (t, str, expectedUnit) => {
    t.plan(4);
    t.context.parser.feed(str);
    t.true(Array.isArray(t.context.parser.results));
    t.is(t.context.parser.results.length, 1);
    t.is(t.context.parser.results[0].length, 1);
    t.is(t.context.parser.results[0][0].units, expectedUnit);
};
parsesUnits.title = (provided = '', input, expectedUnits) => `parses ${expectedUnits} (given ${input}) ${provided}`;

const parsesValue: Macro<[string, number], Context> = (t, str, expectedValue) => {
    t.plan(4);
    t.context.parser.feed(str);
    t.true(Array.isArray(t.context.parser.results));
    t.is(t.context.parser.results.length, 1);
    t.is(t.context.parser.results[0].length, 1);
    t.is(t.context.parser.results[0][0].value, expectedValue);
}
parsesValue.title = (provided = '', input, expectedUnits) => `${provided}: ${expectedUnits} (given ${input})`;

test(parsesUnits, "5W", "watts");

test("parses wattage value", parsesValue, "5W", 5);

test("parses watts cases-insensitvely", parsesUnits, "5w", "watts");

test("handles decimals", parsesValue, "5.5W", 5.5);

test("handles spaces", parsesValue, "5 W", 5);

test("parses bpm", parsesUnits, "5bpm", "bpm");
