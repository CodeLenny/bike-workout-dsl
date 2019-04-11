import test from "ava";
import * as path from "path";
import * as fs from "fs-extra";
import BikeWorkoutDSL from "../../BikeWorkoutDSL";

test("compiles basic workout", async t => {
    t.plan(5);
    const workout = await fs.readFile(path.resolve(__dirname, "fixtures/basic/basic.workout"), "utf8");
    const dsl = new BikeWorkoutDSL({ ftp: 120 }, workout);
    const ergFiles = dsl.toErg();
    t.is(ergFiles.length, 2);
    t.snapshot(ergFiles[0].getName(), { id: 'basic-erg-0-name' });
    t.snapshot(ergFiles[0].getContents(), { id: 'basic-erg-0-contents' });
    t.snapshot(ergFiles[1].getName(), { id: 'basic-erg-1-name' });
    t.snapshot(ergFiles[1].getContents(), { id: 'basic-erg-1-contents' });
});
