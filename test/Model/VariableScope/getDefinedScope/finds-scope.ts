import test from "ava";
import VariableScope from "../../../../Model/VariableScope";
import VariableReference from "../../../../Model/VariableReference";

const ref = new VariableReference({ value: "foo", line: 1, col: 1 });

test("Returns self if variable inside current scope", t => {
    const scope = new VariableScope();
    scope.setStringValue(ref, "test");
    t.is(scope.getDefinedScope(ref).unwrap(), scope);
});

test("Returns child if variable inside child", t => {
    const parent = new VariableScope();
    const child = new VariableScope(parent);
    child.setStringValue(ref, "test");
    t.is(child.getDefinedScope(ref).unwrap(), child);
});

test("Returns parent if variable inside parent", t => {
    const parent = new VariableScope();
    parent.setStringValue(ref, "test");
    const child = new VariableScope(parent);
    t.is(child.getDefinedScope(ref).unwrap(), parent);
});

test("Returns empty Option if variable not found", t => {
    const scope = new VariableScope();
    t.true(scope.getDefinedScope(ref).isNone);
});
