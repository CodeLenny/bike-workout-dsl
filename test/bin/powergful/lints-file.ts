import * as fs from "fs-extra";
import * as path from "path";
import test from "ava";
import { exec } from "child-process-promise";

const powergfulBinary = path.resolve(__dirname, "../../../bin/powergful.js");
const fixturesDir = path.resolve(__dirname, "./fixtures");
const simpleWorkoutInput = path.resolve(fixturesDir, "simple.workout");
const twoWorkoutInput = path.resolve(fixturesDir, "two.workout");

test("Lints a workout", async t => {
    const output = await exec(`node ${powergfulBinary} lint ${simpleWorkoutInput}`);
    t.not(output.stdout.indexOf("0 Errors, 0 Warnings"), -1);
});

test("Counts the number of workouts", async t => {
    const output = await exec(`node ${powergfulBinary} lint ${twoWorkoutInput}`);
    t.not(output.stdout.indexOf("Found 2 workouts."), -1);
});
