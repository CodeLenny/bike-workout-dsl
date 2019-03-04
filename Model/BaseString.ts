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
