import test from "ava";
import * as lexer from "../../lexer";

test("can contain numbers", t => {
    lexer.reset("(5)");
    t.is(lexer.next().type, "startEquation");
    t.is(lexer.next().type, "uint");
    t.is(lexer.next().type, "endEquation");
    t.is(lexer.next(), undefined);
});

test("can contain strings", t => {
    lexer.reset(`("test")`);
    t.is(lexer.next().type, "startEquation");
    t.is(lexer.next().type, "startString");
    t.is(lexer.next().type, "text");
    t.is(lexer.next().type, "endString");
    t.is(lexer.next().type, "endEquation");
    t.is(lexer.next(), undefined);
});

test("can include equations", t => {
    lexer.reset(`(5+10)`);
    t.is(lexer.next().type, "startEquation");
    t.is(lexer.next().type, "uint");
    t.is(lexer.next().type, "plus");
    t.is(lexer.next().type, "uint");
    t.is(lexer.next().type, "endEquation");
    t.is(lexer.next(), undefined);
});

test("can include spaces", t => {
    lexer.reset(`(5 + 10)`);
    t.is(lexer.next().type, "startEquation");
    t.is(lexer.next().type, "uint");
    t.is(lexer.next().type, "ws");
    t.is(lexer.next().type, "plus");
    t.is(lexer.next().type, "ws");
    t.is(lexer.next().type, "uint");
    t.is(lexer.next().type, "endEquation");
    t.is(lexer.next(), undefined);
});

test("can be nested", t => {
    lexer.reset(`(5 + (10 * 2))`);
    t.is(lexer.next().type, "startEquation");
    t.is(lexer.next().type, "uint");
    t.is(lexer.next().type, "ws");
    t.is(lexer.next().type, "plus");
    t.is(lexer.next().type, "ws");

    t.is(lexer.next().type, "startEquation");
    t.is(lexer.next().type, "uint");
    t.is(lexer.next().type, "ws");
    t.is(lexer.next().type, "multiply");
    t.is(lexer.next().type, "ws");
    t.is(lexer.next().type, "uint");
    t.is(lexer.next().type, "endEquation");

    t.is(lexer.next().type, "endEquation");
    t.is(lexer.next(), undefined);
});
