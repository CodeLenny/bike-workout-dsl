import BaseString, { StringTextContent, StringVariableContent, StringEquationContent } from "./BaseString";
import Container from "./Container";

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
                case "equation":
                    this.contents.push(new StringEquationContent(this, content));
                default:
                    throw new TypeError("Unknown interpolated string type: " + content.type);
            }
        }
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
