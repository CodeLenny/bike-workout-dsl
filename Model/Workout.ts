import Plan from "./Plan";
import Activity from "./Activity";
import File from "./File";
import stripIndent = require("strip-indent");
import Container from "./Container";
import ActiveEntry, { createActiveEntry } from "./ActiveEntry";

export default class Workout implements Container {

    private readonly plan: Plan;

    /**
     * All entries that will turn into actions, in the order that they were defined.
     */
    private readonly entries: ActiveEntry[];

    constructor(plan: Plan, workout) {
        this.plan = plan;
        // this.metadata = new Metadata(workout.metadata);
        this.entries = [];
        if(workout.entries && Array.isArray(workout.entries)) {
            for(const entry of workout.entries) {
                this.entries.push(createActiveEntry(this, entry, this.getLastEntry()));
            }
        }
    }

    /**
     * A short description of the workout that can be embedded in a workout file (single line)
     */
    public getShortDescription(): string {
        // TODO: Implement
        return "";
    }

    /**
     * The output filename for this workout.  Omits extension.
     */
    public getFileName(): string {
        // TODO: Check for format
        // TODO: Enstantiate format (e.g. allow "$YYYY-$MM-$DD_Workout_1")
        return "";
    }

    public getFTP(): number {
        return this.plan.getFTP();
    }

    private getCourseData(): string {
        return stripIndent(this.entries
            .map(entry => entry.getErgCourseData())
            .join("\n"));
    }

    private getCourseText(): string {
        // TODO: Implement
        return stripIndent("");
    }

    private getLastEntry(): ActiveEntry | null {
        if(this.entries.length === 0) {
            return null;
        } else {
            return this.entries[this.entries.length - 1];
        }
    }

    public toErg(): File {
        const fileName = `${this.getFileName()}.erg`;
        // TODO: Support non-watt output
        const header = stripIndent(`
            [COURSE HEADER]
            VERSION = 2
            UNITS = ENGLISH
            DESCRIPTION = ${this.getShortDescription()}
            FILE NAME = ${fileName}
            FTP = ${this.getFTP()}
            MINUTES WATTS
            [END COURSE HEADER]
            [COURSE DATA]`).slice(1);

        const courseDataTextTransition = stripIndent(`
            [END COURSE DATA]
            [COURSE TEXT]`).slice(1);

        const footer = stripIndent(`
            [END COURSE TEXT]`).slice(1);

        const body = `${this.getCourseData()}\n${courseDataTextTransition}\n${this.getCourseText()}`;

        const file = `${header}\n${body}\n${footer}`;
        return new File(fileName, file);
    }

    public toJSON(): object {
        return {
            entries: this.entries.map(entry => entry.toJSON()),
        };
    }

}
