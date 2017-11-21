export default class Type {
    constructor(name) {
        this.name = name;
    }

    check(value) { return true; }

    equals(anotherType) {
        return this.name === anotherType.name;
    }
}
