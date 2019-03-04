import test from "ava";
import { StringTextContent } from "../../../../../Model/BaseString";

test("requires 'value' to be a string (not provided)", t => {
    t.throws(() => new StringTextContent({}), TypeError);
});

test("requires 'value' to be a string (number)", t => {
    t.throws(() => new StringTextContent({ value: 5 }), TypeError);
});
