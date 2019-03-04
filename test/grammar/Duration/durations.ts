import anyTest, { Macro, TestInterface } from "ava";
import * as nearley from "nearley";
import * as Plan from "../../../grammar/Plan";

const Duration = nearley.Grammar.fromCompiled(Plan);
Duration.start = "Duration";

interface Context {
    parser: nearley.Parser;
}

interface DurationData {
    hours: number;
    minutes: number;
    seconds: number;
}

const test = anyTest as TestInterface<Context>;

test.beforeEach(t => {
    t.context.parser = new nearley.Parser(Duration);
});

const parsesTime: Macro<[string, DurationData], Context> = (t, provided, expectedDuration) => {
    t.plan(5);
    t.context.parser.feed(provided);
    t.true(Array.isArray(t.context.parser.results));
    t.is(t.context.parser.results.length, 1);
    const parsedDuration = t.context.parser.results[0];
    t.is(parsedDuration.hours, expectedDuration.hours);
    t.is(parsedDuration.minutes, expectedDuration.minutes);
    t.is(parsedDuration.seconds, expectedDuration.seconds);
};
parsesTime.title = (providedTitle = "", providedStr, expectedDuration) =>
    `${providedTitle} "${providedStr}" should produce ${expectedDuration.hours}:${expectedDuration.minutes}:${expectedDuration.seconds}`;

test(parsesTime, "1:23:45", { hours: 1, minutes: 23, seconds: 45 });

test(parsesTime, "1:30", { hours: 0, minutes: 1, seconds: 30 });

test(parsesTime, "5h", { hours: 5, minutes: 0, seconds: 0 });

test(parsesTime, "2m", { hours: 0, minutes: 2, seconds: 0 });

test(parsesTime, "1h 2m 30s", { hours: 1, minutes: 2, seconds: 30 });

test(parsesTime, "1H2M30S", { hours: 1, minutes: 2, seconds: 30 });

test(parsesTime, "20 M", { hours: 0, minutes: 20, seconds: 0 });
