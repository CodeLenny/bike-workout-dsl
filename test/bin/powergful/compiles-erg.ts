import * as fs from "fs-extra";
import * as path from "path";
import test from "ava";
import { exec } from "child-process-promise";

const powergfulBinary = path.resolve(__dirname, "../../../bin/powergful.js");
const fixturesDir = path.resolve(__dirname, "./fixtures");
const simpleWorkoutInput = path.resolve(fixturesDir, "simple.workout");
const simpleWorkoutOutput = path.resolve(fixturesDir, "simple.erg");
const twoWorkoutInput = path.resolve(fixturesDir, "two.workout");
const firstWorkoutOutput = path.resolve(fixturesDir, "two-1.erg");
const secondWorkoutOutput = path.resolve(fixturesDir, "two-2.erg");

test("compiles an ERG file", async t => {
    await fs.remove(simpleWorkoutOutput);
    await exec(`node ${powergfulBinary} convert --outdir ${fixturesDir} ${simpleWorkoutInput}`);
    const exists = await fs.pathExists(simpleWorkoutOutput);
    t.is(exists, true);
});

test("outputs multiple workouts", async t => {
    t.plan(2);
    await fs.remove(firstWorkoutOutput);
    await fs.remove(secondWorkoutOutput);
    await exec(`node ${powergfulBinary} convert --outdir ${fixturesDir} ${twoWorkoutInput}`);
    t.is(await fs.pathExists(firstWorkoutOutput), true);
    t.is(await fs.pathExists(secondWorkoutOutput), true);
});
