import test, { Macro } from "ava";
import * as lexer from "../../../lexer";

const nint: Macro<[string, number]> = (t, input, expected) => {
    lexer.reset(input);
    const number = lexer.next();
    t.is(number.type, "nint");
    t.is(number.text, input);
    t.is(number.value, expected);
    t.is(lexer.next(), undefined);
};
nint.title = (provided = '', input, expected) => `Parses nint '${input}' as '${expected}' ${provided}`;

const uint: Macro<[string, number]> = (t, input, expected) => {
    lexer.reset(input);
    const number = lexer.next();
    t.is(number.type, "uint");
    t.is(number.text, input);
    t.is(number.value, expected);
    t.is(lexer.next(), undefined);
};
uint.title = (provided = '', input, expected) => `Parses uint '${input}' as '${expected}' ${provided}`;

const nfloat: Macro<[string, number]> = (t, input, expected) => {
    lexer.reset(input);
    const number = lexer.next();
    t.is(number.type, "nfloat");
    t.is(number.text, input);
    t.is(number.value, expected);
    t.is(lexer.next(), undefined);
};
nfloat.title = (provided = '', input, expected) => `Parses nfloat '${input}' as '${expected}' ${provided}`;

const ufloat: Macro<[string, number]> = (t, input, expected) => {
    lexer.reset(input);
    const number = lexer.next();
    t.is(number.type, "ufloat");
    t.is(number.text, input);
    t.is(number.value, expected);
    t.is(lexer.next(), undefined);
};
ufloat.title = (provided = '', input, expected) => `Parses ufloat '${input}' as '${expected}' ${provided}`;

test(nint, "-1", -1);
test(nint, "-001", -1);
test(nint, "-15", -15);

test(uint, "0", 0);
test(uint, "1", 1);
test(uint, "15", 15);
test(uint, "0015", 15);

test(nfloat, "-1.5", -1.5);
test(nfloat, "-1.", -1);
test(nfloat, "-.5", -0.5);
test(nfloat, "-15.25", -15.25);

test(ufloat, "1.5", 1.5);
test(ufloat, "1.", 1);
test(ufloat, ".5", 0.5);
test(ufloat, "15.25", 15.25);
