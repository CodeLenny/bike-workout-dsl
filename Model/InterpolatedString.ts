import BaseString, { StringTextContent, StringContent } from "./BaseString";
import Container from "./Container";
import VariableReference from "./VariableReference";
import Equation from "./Equation";

export type InterpolatedStringContents = StringTextContent | StringVariableContent | StringEquationContent;

export default class InterpolatedString extends BaseString<InterpolatedStringContents> implements Container {

    private readonly parent: Container;

    constructor(parent: Container, contents: object) {
        super();
        this.parent = parent;
        if(!Array.isArray(contents)) {
            throw new TypeError("InterpolatedString must be provided an array.");
        }
        for (const content of contents) {
            if(!content.type || typeof content.type !== "string") {
                throw new Error("InterpolatedString contents must provide a 'type'");
            }
            switch (content.type) {
                case "text":
                    this.contents.push(new StringTextContent(content));
                    break;
                case "variable":
                    this.contents.push(new StringVariableContent(this, content));
                    break;
                case "equation":
                    this.contents.push(new StringEquationContent(this, content));
                    break;
                default:
                    throw new TypeError("Unknown interpolated string type: " + content.type);
            }
        }
    }

    public getText(): string {
        return this.contents.map(content => content.getText()).join("");
    }

    public getFTP(): number {
        return this.parent.getFTP();
    }

    public compileVariables() {
        return;
    }

    public getVariables() {
        return this.parent.getVariables();
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
        return this.string.getVariables().getStringValue(this.variable);
    }

}

export class StringEquationContent extends StringContent {

    private readonly equation: Equation;

    constructor(parent: InterpolatedString, contents: object) {
        super();
        this.equation = Equation.createEquation(parent, contents["value"]);
    }

    getText(): string {
        return this.equation.getStringValue();
    }

}
