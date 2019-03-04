import Container from "./Container";
import VariableReference from "./VariableReference";
import { createSome, createNone, Option } from "option-t";

/**
 * Holds variables for a scope.
 */
export default class VariableScope {

    private readonly variables: Map<string, string|number>;
    private readonly parent?: Container;

    public constructor(parent?: Container) {
        this.parent = parent;
        this.variables = new Map();
    }

    public variableDefined(variable: VariableReference): boolean {
        return this.variables.has(variable.getName())
            || (this.parent && this.parent.getVariables().variableDefined(variable));
    }

    public getDefinedScope(variable: VariableReference): Option<VariableScope> {
        if(this.variables.has(variable.getName())) {
            return createSome(this);
        }
        if(!this.parent) {
            return createNone();
        }
        return this.parent.getVariables().getDefinedScope(variable);
    }

    public setNumericValue(variable: VariableReference, value: number) {
        this
            .getDefinedScope(variable)
            .unwrapOr(this)
            .variables
            .set(variable.getName(), value);
    }

    public setStringValue(variable: VariableReference, value: string) {
        this
            .getDefinedScope(variable)
            .unwrapOr(this)
            .variables
            .set(variable.getName(), value);
    }

    public getNumericValue(variable: VariableReference): number {
        const scope = this.getDefinedScope(variable);
        if(scope.isNone) {
            throw new ReferenceError("Variable $" + variable.getName() + " is not defined.");
        }
        const value = scope.unwrap().variables.get(variable.getName());
        if(typeof value === "string") {
            throw new TypeError("Variable $" + variable.getName() + " is a string.  Unable to coerse into a number.");
        }
        return value;
    }

    public getStringValue(variable: VariableReference): string {
        const scope = this.getDefinedScope(variable);
        if(scope.isNone) {
            throw new ReferenceError("Variable $" + variable.getName() + " is not defined.");
        }
        const value = scope.unwrap().variables.get(variable.getName());
        return "" + value;
    }

}
