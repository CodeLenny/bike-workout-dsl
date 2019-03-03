import test from "ava";
import * as nearley from "nearley";
import * as Strength from "../../../grammar/Strength";

test("parses two values", t => {
    t.plan(2);
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(Strength));
    parser.feed("5W / 3.2 bpm");
    t.is(parser.results.length, 1);
    t.deepEqual(parser.results[0], [
        { type: "number", value: 5, units: "watts" },
        { type: "number", value: 3.2, units: "bpm" },
    ]);
});

test("parses duplicate units", t => {
    t.plan(2);
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(Strength));
    parser.feed("5W / 3.2 w");
    t.is(parser.results.length, 1);
    t.deepEqual(parser.results[0], [
        { type: "number", value: 5, units: "watts" },
        { type: "number", value: 3.2, units: "watts" },
    ]);
});

test("parses 3 values", t => {
    t.plan(2);
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(Strength));
    parser.feed("5W / 3.2 bpm / 20% FTP");
    t.is(parser.results.length, 1);
    t.deepEqual(parser.results[0], [
        { type: "number", value: 5, units: "watts" },
        { type: "number", value: 3.2, units: "bpm" },
        { type: "number", value: 20, units: "ftp" },
    ]);
});

test("parses all values", t => {
    t.plan(2);
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(Strength));
    parser.feed("5W / 3.2 bpm / 20% FTP / 30.82 % FTHR");
    t.is(parser.results.length, 1);
    t.deepEqual(parser.results[0], [
        { type: "number", value: 5, units: "watts" },
        { type: "number", value: 3.2, units: "bpm" },
        { type: "number", value: 20, units: "ftp" },
        { type: "number", value: 30.82, units: "fthr" },
    ]);
});
