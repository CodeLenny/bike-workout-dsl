import VariableReference from "./VariableReference";
import InterpolatedString from "./InterpolatedString";
import Equation from "./Equation";

/**
 * Base class to represent interpolated and plain strings.
 */
export default class BaseString<T extends StringContent> {

    protected readonly contents: T[];

    constructor() {
        this.contents = [];
    }

    public getText(): string {
        throw new Error("BaseString#getText() is abstract.");
    }

}

/**
 * A segment of a string.
 */
export class StringContent {

    getText(): string {
        throw new Error("StringContent#getText() is abstract.");
    }

}

/**
 * Plain text that's part of a string.
 */
export class StringTextContent extends StringContent {

    private readonly text: string;

    constructor(contents: object) {
        super();
        if(typeof contents["value"] !== "string") {
            throw new TypeError("Must provide a value for StringTextContent");
        }
        this.text = contents["value"];
    }

    getText(): string {
        return this.text;
    }

}

/**
 * A variable referenced in a string.
 */
export class StringVariableContent extends StringContent {

    private readonly string: InterpolatedString;
    private readonly variable: VariableReference;

    constructor(parent: InterpolatedString, contents: object) {
        super();
        this.string = parent;
        this.variable = new VariableReference(contents);
    }

    getText(): string {
        throw new ReferenceError("Variable interpolation in strings is not yet supported.");
    }

}

export class StringEquationContent extends StringContent {

    private readonly string: InterpolatedString;
    private readonly equation: Equation;

    constructor(parent: InterpolatedString, contents: object) {
        super();
        this.string = parent;
        this.equation = Equation.createEquation(parent, contents["value"]);
    }

}
