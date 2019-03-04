import test from "ava";
import Container from "../../../../../Model/Container";
import VariableScope from "../../../../../Model/VariableScope";
import VariableReference from "../../../../../Model/VariableReference";
import InterpolatedString from "../../../../../Model/InterpolatedString";

class TestContainer implements Container {

    public variables: VariableScope;

    constructor() {
        this.variables = new VariableScope();
    }

    public getFTP() {
        return 120;
    }

    public compileVariables() {}

    public getVariables() {
        return this.variables;
    }

}

test("concatenates string", t => {
    const container = new TestContainer();
    container.variables.setStringValue(
        new VariableReference({ value: "test", line: 1, col: 1 }),
        "world",
    );
    const str = new InterpolatedString(container, [
        {
            type: "text",
            value: "hello ",
        },
        {
            type: "variable",
            value: "test",
            line: 1,
            col: 1,
        },
        {
            type: "equation",
            value: {
                type: "number",
                value: 1,
            },
        },
    ]);
    t.is(str.getText(), "hello world1");
});
