import Container from "./Container";
import Equation, { NumericEquation } from "./Equation";

export class StrengthType {

    public static readonly WATTS = new StrengthType("watts");
    public static readonly HEART_RATE = new StrengthType("bpm");
    public static readonly FTP = new StrengthType("ftp");
    public static readonly FTHR = new StrengthType("fthr");

    private readonly id: string;

    constructor(id: string) {
        this.id = id;
    }

    public getId() {
        return this.id;
    }

}

export default class Strength {

    private readonly parent: Container;
    private readonly units: string;
    private readonly value: Equation;

    constructor(parent: Container, data) {
        this.parent = parent;
        this.units = data.units;
        this.value = Equation.createEquation(parent, data);
    }

    public hasWatts(): boolean {
        return this.units === StrengthType.WATTS.getId() || this.units === StrengthType.FTP.getId();
    }

    public getWatts(): number {
        if(this.units === StrengthType.WATTS.getId()) {
            return this.value.getNumericalValue();
        } else if(this.units === StrengthType.FTP.getId()) {
            return this.parent.getFTP() * this.value.getNumericalValue() / 100;
        } else {
            throw new TypeError(`Unit ${this.units} doesn't have a wattage.`);
        }
    }

    public toJSON(): object {
        return {
            units: this.units,
            value: this.value,
        };
    }

}
