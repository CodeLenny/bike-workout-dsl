export default class VariableReference {

    private readonly variableName: string;
    private readonly line: number;
    private readonly col: number;

    constructor(obj: object) {
        if(typeof obj !== "object" || !obj) {
            throw new TypeError("VariableReference must be given an object.");
        }
        if(typeof obj["value"] !== "string") {
            throw new TypeError("VariableReference must be given a string 'value'");
        }
        if(typeof obj["line"] !== "number") {
            throw new TypeError("VariableReference must be given a number 'line'");
        }
        if(typeof obj["col"] !== "number") {
            throw new TypeError("VariableReference must be given a number 'col'");
        }
        this.variableName = obj["value"];
        this.line = obj["line"];
        this.col = obj["col"];
    }

    public getName(): string {
        return this.variableName;
    }

}
