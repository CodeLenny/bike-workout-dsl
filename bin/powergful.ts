#!/usr/bin/env node
import * as cli from "commander";
import * as fs from "fs-extra";
import * as path from "path";
import { BikeWorkoutDSL } from "../BikeWorkoutDSL";

const metadata = require("../package.json");

cli.version(metadata.version);

cli.option("--ftp <ftp>", "Your FTP measurement.");

cli
    .command("lint <input>")
    .description("Parse and verify a PowERGful file, without compiling it.")
    .action(function(input, options) {
        const parser = new BikeWorkoutDSL(
            {
                ftp: options.ftp,
                outputFilename: path.basename(input, path.extname(input)),
            },
            input,
        );
    });

cli
    .command("convert <input>")
    .description("Compile a powERGful file into workout files")
    .option("-o, --outdir <directory>", "A directory to output compiled files into.  Will be recursively created if non-existent.")
    .option("--erg", "Output format: ERG file (default)")
    .option("--fit", "Output format: FIT format")
    .action(function(input, options) {
        let task: Promise<void[]>;
        const parser: Promise<BikeWorkoutDSL> = fs
            .readFile(input, "utf8")
            .then(workoutFile => new BikeWorkoutDSL(
                {
                    ftp: options.ftp,
                    outputFilename: path.basename(input, path.extname(input)),
                },
                workoutFile,
            ));
        if(options.fit) {
            throw new Error("FIT output is not supported.");
        } else {
            const dir = fs.ensureDir(path.resolve(options.outdir));
            task = parser
                .then(p => p.toErg())
                .then(files => Promise.all(files.map(file => dir.then(() => fs.writeFile(path.resolve(options.outdir, file.getName()), file.getContents())))));
        }
        task.catch(err => {
            console.error(err.stack);
            process.exitCode = 1;
        });
    });

cli.parse(process.argv);
