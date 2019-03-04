import test from "ava";
import * as nearley from "nearley";
import * as Plan from "../../../grammar/Plan";
const stripIndent = require("strip-indent");

const Workout = nearley.Grammar.fromCompiled(Plan);
Workout.start = "Workout";

test("parses single activity", t => {
    t.plan(4);
    const parser = new nearley.Parser(Workout);
    parser.feed("5m at 20W\n");
    t.is(parser.results.length, 1);
    t.true(Array.isArray(parser.results[0].entries));
    t.is(parser.results[0].entries.length, 1);
    t.is(parser.results[0].entries[0].type, "activity");
});
