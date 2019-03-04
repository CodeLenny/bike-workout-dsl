import test from "ava";
import VariableScope from "../../../../Model/VariableScope";
import VariableReference from "../../../../Model/VariableReference";

const ref = new VariableReference({ value: "foo", line: 1, col: 1 });

test("Finds locally declared variables", t => {
    const scope = new VariableScope();
    scope.setStringValue(ref, "Hi");
    t.is(scope.variableDefined(ref), true);
});

test("Finds variables declared in parent", t => {
    const parent = new VariableScope();
    parent.setStringValue(ref, "Hi");
    const child = new VariableScope(parent);
    t.is(child.variableDefined(ref), true);
});

test("Can't find non-declared variables", t => {
    const scope = new VariableScope();
    t.is(scope.variableDefined(ref), false);
});

test("Can't find non-declared variables, even with parent", t => {
    const parent = new VariableScope();
    const child = new VariableScope(parent);
    t.is(child.variableDefined(ref), false);
});
