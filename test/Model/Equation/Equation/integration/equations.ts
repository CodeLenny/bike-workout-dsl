import test, { Macro } from "ava";
import * as nearley from "nearley";
import * as Plan from "../../../../../grammar/Plan";
import Container from "../../../../../Model/Container";
import VariableScope from "../../../../../Model/VariableScope";
import VariableReference from "../../../../../Model/VariableReference";
import Equation from "../../../../../Model/Equation";

const EquationGrammar = nearley.Grammar.fromCompiled(Plan);
EquationGrammar.start = "Equation";

class TestContainer implements Container {

    public variables: VariableScope;

    constructor() {
        this.variables = new VariableScope();
        this.variables.setStringValue(
            new VariableReference({ value: "str", line: 1, col: 1 }),
            "world",
        );
        this.variables.setNumericValue(
            new VariableReference({ value: "num", line: 1, col: 1 }),
            1,
        );
    }

    public getFTP() {
        return 120;
    }

    public compileVariables() {}

    public getVariables() {
        return this.variables;
    }

}

const parsesStringEquation: Macro<[string, string]> = (t, input, output) => {
    const parser = new nearley.Parser(EquationGrammar);
    parser.feed(input);
    t.is(parser.results.length, 1);
    const container = new TestContainer();
    const equation = Equation.createEquation(container, parser.results[0]);
    t.is(equation.getStringValue(), output);
};
parsesStringEquation.title = (given, input, output) => `'${input}' produces (string) '${output}'`;

const parsesNumericEquation: Macro<[string, number]> = (t, input, output) => {
    const parser = new nearley.Parser(EquationGrammar);
    parser.feed(input);
    t.is(parser.results.length, 1);
    const container = new TestContainer();
    const equation = Equation.createEquation(container, parser.results[0]);
    t.is(equation.getNumericalValue(), output);
};
parsesNumericEquation.title = (given, input, output) => `'${input}' produces (number) ${output}`;

test(parsesStringEquation, '("test")', "test");
test(parsesStringEquation, "('test')", "test");
test(parsesStringEquation, "($str)", "world");
test(parsesStringEquation, '("hello $str")', "hello world");
test(parsesStringEquation, '("hello $str$num")', "hello world1");
test(parsesStringEquation, '("hello ${$str}!")', "hello world!");
test(parsesStringEquation, '("hello " + "world")', "hello world");
test(parsesStringEquation, '("hello " + 1)', "hello 1");
test(parsesStringEquation, '(1 + "world")', "1world");

test(parsesNumericEquation, "5", 5);
test(parsesNumericEquation, "(5)", 5);
test(parsesNumericEquation, "(5 + 10)", 15);
test(parsesNumericEquation, "(5 * 10)", 50);
test(parsesNumericEquation, "(10 / 5)", 2);
test(parsesNumericEquation, "(10 - 5)", 5);
