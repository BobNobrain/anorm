export default class Type {
    /**
     * Creates an instance representing a type
     * @param  {String} name Type name
     */
    constructor(name) {
        this.name = name;
    }

    /**
     * Checks a value to be of this type
     * @param  {any}     value a value to check
     * @return {Boolean}       can given value be assigned to column of this type or not
     */
    check(value) { return { success: true }; }

    /**
     * Compares this type to another
     * @param  {Type}    anotherType another type
     * @return {Boolean}             Are types equal
     */
    equals(anotherType) {
        return this.name === anotherType.name;
    }
}
