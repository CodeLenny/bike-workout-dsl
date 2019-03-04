import test from "ava";
import { StringContent } from "../../../../../Model/BaseString";

test("abstract", t => {
    const string = new StringContent();
    t.throws(() => string.getText(), Error);
});
