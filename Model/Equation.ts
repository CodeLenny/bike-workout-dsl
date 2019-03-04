import InterpolatedString from "./InterpolatedString";
import Container from "./Container";
import VariableReference from "./VariableReference";

/**
 * Base class to represent an equation.
 */
export default class Equation {

    public static createEquation(parent: Container, obj: object) {
        if(!obj || typeof obj !== "object") {
            throw new TypeError("Equation.createEquation must be given an object.");
        }
        if(!obj["type"] || typeof obj["type"] !== "string") {
            throw new TypeError("Equations must have a 'type'");
        }
        switch (obj["type"]) {
            case "string":
                return new StringEquation(parent, obj);
            case "equation":
                return new NestedEquation(parent, obj);
            case "variable":
                return new VariableEquation(parent, obj);
            case "number":
                return new NumericEquation(parent, obj);
            case "multiply":
                return new MultiplicationEquation(parent, obj);
            case "divide":
                return new DivisionEquation(parent, obj);
            case "plus":
                return new AdditionEquation(parent, obj);
            case "minus":
                return new SubtractionEquation(parent, obj);
            default:
                throw new Error("Unknown type of equation: " + obj["type"]);
        }
    }

    protected readonly parent: Container;

    constructor(parent: Container) {
        this.parent = parent;
    }

    getStringValue(): string {
        throw new Error("Equation#getStringValue is abstract.");
    }

    getNumericalValue(): number {
        throw new Error("Equation#getNumericalValue is abstract.");
    }

}


export class StringEquation extends Equation {

    private readonly string: InterpolatedString;

    constructor(parent: Container, contents: object) {
        super(parent);
        this.string = new InterpolatedString(parent, contents["value"]);
    }

    getStringValue(): string {
        return this.string.getText();
    }

    getNumericalValue(): number {
        throw new TypeError("Strings cannot be cast to numbers.");
    }

}

export class NestedEquation extends Equation {

    private readonly nested: Equation;

    constructor(parent: Container, contents: object) {
        super(parent);
        this.nested = Equation.createEquation(parent, contents["value"]);
    }

    getStringValue(): string {
        return this.nested.getStringValue();
    }

    getNumericalValue(): number {
        return this.nested.getNumericalValue();
    }

}

export class VariableEquation extends Equation {

    private readonly variable: VariableReference;

    constructor(parent: Container, contents: object) {
        super(parent);
        this.variable = new VariableReference(contents);
    }

    getStringValue(): string {
        return this.parent.getVariables().getStringValue(this.variable);
    }

    getNumericalValue(): number {
        return this.parent.getVariables().getNumericValue(this.variable);
    }

}

export class NumericEquation extends Equation {

    private readonly number: number;

    constructor(parent: Container, contents: object) {
        super(parent);
        this.number = contents["value"];
    }

    getStringValue(): string {
        return "" + this.number;
    }

    getNumericalValue(): number {
        return this.number;
    }

}

export class TwoOperationEquation extends Equation {

    protected readonly left: Equation;
    protected readonly right: Equation;
    private readonly line: number;
    private readonly col: number;

    constructor(parent: Container, contents: object) {
        super(parent);
        this.left = Equation.createEquation(parent, contents["left"]);
        this.right = Equation.createEquation(parent, contents["right"]);
        this.line = contents["line"];
        this.col = contents["col"];
    }

    getStringValue(): string {
        throw new TypeError(`Cannot perform mathematical operations on strings.  Operation on line ${this.line}, column ${this.col}`)
    }

}

export class MultiplicationEquation extends TwoOperationEquation {

    getNumericalValue(): number {
        return this.left.getNumericalValue() * this.right.getNumericalValue();
    }

}

export class DivisionEquation extends TwoOperationEquation {

    getNumericalValue(): number {
        return this.left.getNumericalValue() / this.right.getNumericalValue();
    }

}

export class AdditionEquation extends TwoOperationEquation {

    getStringValue(): string {
        return "" + this.left.getStringValue() + this.right.getStringValue();
    }

    getNumericalValue(): number {
        return this.left.getNumericalValue() + this.right.getNumericalValue();
    }

}

export class SubtractionEquation extends TwoOperationEquation {

    getNumericalValue(): number {
        return this.left.getNumericalValue() - this.right.getNumericalValue();
    }

}
