import test from "ava";
import VariableScope from "../../../../Model/VariableScope";
import VariableReference from "../../../../Model/VariableReference";

const ref = new VariableReference({ value: "foo", line: 1, col: 1 });

test("Returns number", t => {
    const scope = new VariableScope();
    scope.setNumericValue(ref, 5);
    t.is(scope.getNumericValue(ref), 5);
});

test("Complains if variable doesn't exist", t => {
    const scope = new VariableScope();
    t.throws(() => scope.getNumericValue(ref), ReferenceError);
});

test("Complains if given string", t => {
    const scope = new VariableScope();
    scope.setStringValue(ref, "hello");
    t.throws(() => scope.getNumericValue(ref), TypeError);
});
