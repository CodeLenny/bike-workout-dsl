import test from "ava";
import BaseString, { StringContent } from "../../../../../Model/BaseString";

test("abstract", t => {
    const string = new BaseString<StringContent>();
    t.throws(() => string.getText(), Error);
});
