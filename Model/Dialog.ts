import Container from "./Container";
import Duration from "./Duration";
import InterpolatedString from "./InterpolatedString";

export default class Dialog {

    private readonly parent: Container;
    private readonly message: InterpolatedString;
    private readonly offset?: Duration;

    constructor(parent: Container, data) {
        this.parent = parent;
        this.message = new InterpolatedString(parent, data.message);
        if(data.offset) {
            this.offset = new Duration(parent, data.offset);
        }
    }

    public toJSON(): object {
        return {
            message: this.message.getText(),
            offset: this.offset.toJSON(),
        };
    }

}
