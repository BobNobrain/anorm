import Type from './Type';
import Column from '../Column';

class ArrayType extends Type {
    constructor(type) {
        super('Array<' + type.name + '>');
        this.ofType = type;
        this.isArray = true;
    }

    check(value) {
        if (!Array.isArray(value)) {
            return { success: false, error: 'value is not an array!' };
        }
        if (!Array.every(item => this.ofType.check(item))) {
            return { success: false, error: 'all items inside array should be of type' + this.ofType.name };
        }
        return { success: true };
    }

    equals(anotherType) {
        return (anotherType instanceof ArrayType) && (anotherType.ofType.equals(this.ofType));
    }
}

export const ArrayOf = (type, ...directives) => {
    const t = new ArrayType(type);
    return new Column(t, ...directives);
};

// aliases
export const TArray = ArrayOf;
export const List = ArrayOf;
export const Many = ArrayOf;
