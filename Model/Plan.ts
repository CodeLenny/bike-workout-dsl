import Workout from "./Workout";
import File from "./File";
import VariableScope from "./VariableScope";
import Container from "./Container";

export interface PlanOptions {
    ftp?: number;
}

export default class Plan implements Container {

    private readonly options: PlanOptions;
    private readonly workouts: Workout[];
    private readonly variables: VariableScope;

    constructor(options: PlanOptions, plan: object) {
        this.options = options;
        if(plan) {
            if(!Array.isArray(plan)) {
                throw new Error("Plan must be an array.");
            }
            this.workouts = plan.map(workout => new Workout(this, workout));
        }
    }

    public getFTP(): number {
        if(this.options.ftp) {
            return this.options.ftp;
        } else {
            return 0;
        }
    }

    public getVariables(): VariableScope {
        return this.variables;
    }

    public compileVariables() {
        this.workouts.map(workout => workout.compileVariables());
    }

    public toErg(): File[] {
        return this.workouts.map(workout => workout.toErg());
    }

    public toJSON(): object {
        return this.workouts.map(workout => workout.toJSON());
    }

}
