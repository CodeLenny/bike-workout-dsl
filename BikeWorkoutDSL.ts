import * as nearley from "nearley";
import * as PlanGrammar from "./grammar/Plan";
import Plan, { PlanOptions } from "./Model/Plan";
import File from "./Model/File";

export class BikeWorkoutDSL {

    private readonly options: PlanOptions;
    private readonly source: string;
    private readonly plan: Plan;

    constructor(options: PlanOptions, plan: string) {
        this.options = options;
        this.source = plan;
        const parser = new nearley.Parser(nearley.Grammar.fromCompiled(PlanGrammar));
        parser.feed(plan);
        if(parser.results.length > 1) {
            throw new Error("Ambiguous: parser returned multiple results.");
        }
        this.plan = new Plan(options, parser.results[0]);
        this.plan.compileVariables();
    }

    public getSource() {
        return this.source;
    }

    public getPlan() {
        return this.plan;
    }

    public toErg(): File[] {
        return this.plan.toErg();
    }

}
