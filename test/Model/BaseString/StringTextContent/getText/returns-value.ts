import test from "ava";
import { StringTextContent } from "../../../../../Model/BaseString";

test("returns stored text", t => {
    const str = new StringTextContent({ value: "test" });
    t.is(str.getText(), "test");
});
