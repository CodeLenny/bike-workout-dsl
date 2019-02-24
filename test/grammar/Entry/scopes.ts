import test, { Macro } from "ava";
import * as nearley from "nearley";
import * as Entry from "../../../grammar/Entry";
const stripIndent = require("strip-indent");

test("Can parse scopes", t => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(Entry));
    parser.feed(stripIndent(`\
        {
            "Work" 5m at 50% FTP
        }
        `));
    t.is(parser.results.length, 1);
    const entries = parser.results[0];
    t.is(entries.length, 1);
    const scope = entries[0];
    t.is(scope.type, "scope");
});

test("Parses activities inside scope", t => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(Entry));
    parser.feed(stripIndent(`\
        {
            "Work" 5m at 50% FTP
        }
        `));
    t.is(parser.results.length, 1);
    const entries = parser.results[0];
    const scope = entries[0];
    t.is(scope.contents.length, 1);
    t.is(scope.contents[0].type, "activity");
});

test("Marks scopes as single entities", t => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(Entry));
    parser.feed(stripIndent(`\
        {
            "Work" 5m at 50% FTP
            "Work" 10m at 100% FTP
        }
        `));
    t.is(parser.results.length, 1);
    const entries = parser.results[0];
    const scope = entries[0];
    t.is(scope.contents.length, 2);
});

test("Parses scopes inside entries", t => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(Entry));
    parser.feed(stripIndent(`\
        "Start" 5m at 25% FTP
        {
            "Work" 5m at 50% FTP
        }
        "End" 5m at 25% FTP
        `));
    t.is(parser.results.length, 1);
    const entries = parser.results[0];
    t.is(entries.length, 3);
    t.is(entries[0].type, "activity");
    t.is(entries[1].type, "scope");
    t.is(entries[2].type, "activity");
});

test("Scopes can be nested", t => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(Entry));
    parser.feed(stripIndent(`\
        {
            "Outer" 5m at 50% FTP
            {
                "Inner" 5m at 100% FTP
            }
        }
        `));
    t.is(parser.results.length, 1);
    const outer = parser.results[0][0];
    t.is(outer.type, "scope");
    t.is(outer.contents.length, 2);
    const [ outerActivity, inner ] = outer.contents;
    t.is(inner.type, "scope");
    t.is(inner.contents.length, 1);
});
