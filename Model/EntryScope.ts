import ActiveEntry, { createActiveEntry } from "./ActiveEntry";
import Container from "./Container";
import Duration from "./Duration";
import stripIndent = require("strip-indent");

export default class EntryScope implements Container, ActiveEntry {

    private readonly parent: Container;
    private readonly entries: ActiveEntry[];
    private readonly lastEntry?: ActiveEntry;

    constructor(parent: Container, data, lastEntry?: ActiveEntry) {
        this.parent = parent;
        this.lastEntry = lastEntry;
        this.entries = [];
        if(Array.isArray(data.contents)) {
            for(const entry of data.contents) {
                this.entries.push(createActiveEntry(this, entry, this.getLastEntry()));
            }
        }
    }

    getFTP(): number {
        return this.parent.getFTP();
    }

    public getStart(): Duration {
        if(this.lastEntry) {
            return this.lastEntry.getEnd();
        } else {
            return new Duration(this, { hours: 0, minutes: 0, seconds: 0 });
        }
    }

    public getEnd(): Duration {
        if(this.entries.length < 1) {
            return this.getStart();
        }
        const lastEntry = this.entries[this.entries.length - 1];
        return lastEntry.getEnd();
    }

    public getErgCourseData(): string {
        return stripIndent(this.entries
            .map(entry => entry.getErgCourseData())
            .join("\n"));
    }

    public toJSON(): object {
        return {
            entries: this.entries.map(entry => entry.toJSON()),
        };
    }

    private getLastEntry(): ActiveEntry | null {
        if(this.entries.length === 0) {
            return null;
        } else {
            return this.entries[this.entries.length - 1];
        }
    }

}
