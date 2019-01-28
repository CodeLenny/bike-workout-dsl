import Workout from "./Workout";
import File from "./File";

export interface PlanOptions {
    ftp?: number;
}

export default class Plan {

    private readonly options: PlanOptions;
    private readonly workouts: Workout[];

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

    public toErg(): File[] {
        return this.workouts.map(workout => workout.toErg());
    }

    public toJSON(): object {
        return this.workouts.map(workout => workout.toJSON());
    }

}
