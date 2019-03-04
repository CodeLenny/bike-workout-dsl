import Workout from "./Workout";
import Container from "./Container";
import Duration from "./Duration";
import Strength from "./Strength";
import Dialog from "./Dialog";
import ActiveEntry from "./ActiveEntry";
import stripIndent = require("strip-indent");
import VariableScope from "./VariableScope";
import InterpolatedString from "./InterpolatedString";

export default class Activity implements Container, ActiveEntry {

    public static isActivityData(data): boolean {
        return typeof data === "object" && data.type === "activity";
    }

    private readonly workout: Workout;
    private readonly lastEntry?: ActiveEntry;
    private readonly name?: InterpolatedString;
    private readonly description?: InterpolatedString;
    private readonly duration: Duration;
    private readonly strength: Strength[];
    private readonly dialog: Dialog[];
    private readonly variables: VariableScope;

    constructor(workout: Workout, data, lastEntry?: ActiveEntry) {
        this.workout = workout;
        this.variables = new VariableScope(workout);
        this.lastEntry = lastEntry;
        this.name = new InterpolatedString(this, data.name);
        this.description = new InterpolatedString(this, data.description);
        this.duration = new Duration(this, data.duration);
        if(typeof data.strength === "object" && Array.isArray(data.strength)) {
            this.strength = data.strength.map(strength => new Strength(this, strength));
        }
        if(typeof data.dialog === "object" && Array.isArray(data.dialog)) {
            this.dialog = data.dialog.map(dialog => new Dialog(this, dialog));
        }
    }

    public getName(): string {
        // TODO: If name not set, count activities in the workout.
        return this.name.getText();
    }

    public getFTP() {
        return this.workout.getFTP();
    }

    public compileVariables() {
        return;
    }

    public getVariables(): VariableScope {
        return this.variables;
    }

    public getStart(): Duration {
        if(this.lastEntry) {
            return this.lastEntry.getEnd();
        } else {
            return new Duration(this, { hours: 0, minutes: 0, seconds: 0 });
        }
    }

    public getEnd(): Duration {
        return this.getStart().add(this.duration);
    }

    public getWatts(): number {
        const hasWatts = this.strength.filter(strength => strength.hasWatts());
        if(hasWatts.length < 1) {
            throw new Error(`Can't get watts for ${this.getName()}`);
        }
        return hasWatts[0].getWatts();
    }

    public getErgCourseData(): string {
        // TODO: Support non-minutes
        // TODO: Support non-watts
        return stripIndent(`
            ${this.getStart().toMinutes()} ${this.getWatts()}
            ${this.getEnd().toMinutes()} ${this.getWatts()}`).slice(1);
    }

    public toJSON(): object {
        return {
            name: this.name,
            description: this.description,
            duration: this.duration.toString(),
            strength: this.strength.map(strength => strength.toJSON()),
            dialog: this.dialog.map(dialog => dialog.toJSON()),
        };
    }

}
