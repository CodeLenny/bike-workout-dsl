import Duration from "./Duration";

/**
 * An entry that can be enstantiated into one or more activities.
 */
export default interface ActiveEntry {

    getStart(): Duration;

    getEnd(): Duration;

    getErgCourseData(): string;

    toJSON(): object;

}
