import test from "ava";
import VariableScope from "../../../../Model/VariableScope";
import VariableReference from "../../../../Model/VariableReference";

const ref = new VariableReference({ value: "foo", line: 1, col: 1 });

test("Returns string", t => {
    const scope = new VariableScope();
    scope.setStringValue(ref, "hello");
    t.is(scope.getStringValue(ref), "hello");
});

test("Complains if variable not defined", t => {
    const scope = new VariableScope();
    t.throws(() => scope.getStringValue(ref), ReferenceError);
});
