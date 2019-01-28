import Container from "./Container";
import Duration from "./Duration";

export default class Dialog {

    private readonly parent: Container;
    private readonly message: string;
    private readonly offset?: Duration;

    constructor(parent: Container, data) {
        this.parent = parent;
        this.message = data.message;
        if(data.offset) {
            this.offset = new Duration(parent, data.offset);
        }
    }

    public toJSON(): object {
        return {
            message: this.message,
            offset: this.offset.toJSON(),
        };
    }

}
