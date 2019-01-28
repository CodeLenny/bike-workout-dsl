/**
 * A file for output purposes.
 */
export default class File {

    private readonly name: string;
    private readonly contents: string;

    constructor(name: string, contents: string) {
        this.name = name;
        this.contents = contents;
    }

    public getName() {
        return this.name;
    }

    public getContents() {
        return this.contents;
    }

}
