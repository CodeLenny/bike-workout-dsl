import test from "ava";
import * as nearley from "nearley";
import * as Plan from "../../../grammar/Plan";
const stripIndent = require("strip-indent");

const Activity = nearley.Grammar.fromCompiled(Plan);
Activity.start = "Activity";

test("parses minimal activity", t => {
    t.plan(2);
    const parser = new nearley.Parser(Activity);
    parser.feed("5m at 20W\n");
    t.is(parser.results.length, 1);
    t.deepEqual(parser.results[0], {
        type: "activity",
        name: null,
        duration: {
            hours: 0,
            minutes: 5,
            seconds: 0,
        },
        strength: [
            { type: "number", units: "watts", value: 20 },
        ],
        dialog: [],
        description: [],
    });
});

test("parses activity name", t => {
    t.plan(2);
    const parser = new nearley.Parser(Activity);
    parser.feed("\"Test Activity 5\" 5m at 20W\n");
    t.is(parser.results.length, 1);
    t.deepEqual(parser.results[0].name, [ { type: "text", value: "Test Activity 5" }]);
});

test("parses dialog", t => {
    t.plan(4);
    const parser = new nearley.Parser(Activity);
    parser.feed(stripIndent(`
        5m at 20W
        @2m "Keep it up!"
        `).slice(1));
    t.is(parser.results.length, 1);
    t.not(parser.results[0].dialog, null);
    t.is(parser.results[0].dialog.length, 1);
    t.deepEqual(parser.results[0].dialog[0], {
        message: [ { type: "text", value: "Keep it up!" } ],
        offset: { hours: 0, minutes: 2, seconds: 0 },
    });
});

test("parses description", t => {
    t.plan(2);
    const parser = new nearley.Parser(Activity);
    parser.feed(stripIndent(`
        5m at 20W
        > "This is a very easy activity."
        `).slice(1));
    t.is(parser.results.length, 1);
    t.deepEqual(parser.results[0].description, [ { type: "text", value: "This is a very easy activity." } ]);
});

test("parses complete activity", t => {
    t.plan(2);
    const parser = new nearley.Parser(Activity);
    parser.feed(stripIndent(`
        "Long Activity!" 1:30:00 at 300W/250 BPM/75% FTP
          @10m "You're just getting started"
          @30:00 "30 minutes in!"
        @1:00:00 "Hour in!"
            @1h 20m "You're almost done!"
        > "This is a very hard activity."
        > "You're going to need to work very hard."
        `).slice(1));
    t.is(parser.results.length, 1);
    t.deepEqual(parser.results[0], {
        type: "activity",
        name: [
            { type: "text", value: "Long Activity!" },
        ],
        duration: {
            hours: 1,
            minutes: 30,
            seconds: 0,
        },
        strength: [
            { type: "number", units: "watts", value: 300 },
            { type: "number", units: "bpm", value: 250 },
            { type: "number", units: "ftp", value: 75 },
        ],
        dialog: [
            { message: [
                { type: "text", value: "You're just getting started" },
            ], offset: { hours: 0, minutes: 10, seconds: 0 } },
            { message: [
                { type: "text", value: "30 minutes in!" },
            ], offset: { hours: 0, minutes: 30, seconds: 0 } },
            { message: [
                { type: "text", value: "Hour in!" },
            ], offset: { hours: 1, minutes: 0, seconds: 0 } },
            { message: [
                { type: "text", value: "You're almost done!" },
            ], offset: { hours: 1, minutes: 20, seconds: 0 } },
        ],
        description: [
            { type: "text", value: "This is a very hard activity." },
            { type: "text", value: "You're going to need to work very hard." },
        ],
    });
});
