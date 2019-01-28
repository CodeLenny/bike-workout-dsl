import test from "ava";
import * as nearley from "nearley";
import * as Strength from "../../../grammar/Strength";

test("parses two values", t => {
    t.plan(2);
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(Strength));
    parser.feed("5W / 3.2 bpm");
    t.is(parser.results.length, 1);
    t.deepEqual(parser.results[0], [
        { value: 5, units: "watts" },
        { value: 3.2, units: "bpm" },
    ]);
});

test("parses duplicate units", t => {
    t.plan(2);
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(Strength));
    parser.feed("5W / 3.2 w");
    t.is(parser.results.length, 1);
    t.deepEqual(parser.results[0], [
        { value: 5, units: "watts" },
        { value: 3.2, units: "watts" },
    ]);
});

test("parses 3 values", t => {
    t.plan(2);
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(Strength));
    parser.feed("5W / 3.2 bpm / 20% FTP");
    t.is(parser.results.length, 1);
    t.deepEqual(parser.results[0], [
        { value: 5, units: "watts" },
        { value: 3.2, units: "bpm" },
        { value: 20, units: "ftp" },
    ]);
});

test("parses all values", t => {
    t.plan(2);
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(Strength));
    parser.feed("5W / 3.2 bpm / 20% FTP / 30.82 % FTHR");
    t.is(parser.results.length, 1);
    t.deepEqual(parser.results[0], [
        { value: 5, units: "watts" },
        { value: 3.2, units: "bpm" },
        { value: 20, units: "ftp" },
        { value: 30.82, units: "fthr" },
    ]);
});
