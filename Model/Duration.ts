import Container from "./Container";

export default class Duration {

    private readonly parent: Container;
    private readonly hours: number;
    private readonly minutes: number;
    private readonly seconds: number;

    constructor(parent: Container, data) {
        this.parent = parent;
        this.hours = data.hours;
        this.minutes = data.minutes;
        this.seconds = data.seconds;
    }

    toMinutes(): number {
        return this.hours * 60 + this.minutes;
    }

    toSeconds(): number {
        return (this.toMinutes() * 60) + this.seconds;
    }

    add(duration: Duration): Duration {
        const rawSeconds = this.toSeconds() + duration.toSeconds();
        const rawMinutes = Math.floor(rawSeconds / 60);
        const hours = Math.floor(rawMinutes / 60);
        return new Duration(this.parent, {
            seconds: rawSeconds % 60,
            minutes: rawMinutes % 60,
            hours,
        });
    }

    toJSON(): object {
        return {
            hours: this.hours,
            minutes: this.minutes,
            seconds: this.seconds,
        };
    }

}