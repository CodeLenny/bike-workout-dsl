import Duration from "./Duration";
import Activity from "./Activity";
import Container from "./Container";

/**
 * An entry that can be enstantiated into one or more activities.
 * Matches the `Entry` grammar class.
 */
export default interface ActiveEntry {

    getStart(): Duration;

    getEnd(): Duration;

    getErgCourseData(): string;

    toJSON(): object;

}

export function createActiveEntry(parent: Container, data: object, previous?: ActiveEntry): ActiveEntry {
    if(typeof data["type"] !== "string") {
        throw new TypeError("Can't instantiate object: " + data);
    }
    switch (data["type"]) {
        case "activity":
            return new Activity(parent, data, previous);
        default:
            break;
    }
}
