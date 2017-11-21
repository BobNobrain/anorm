import Type from './Type';
import createColumn from './helpers';

/**
 * Generic number type (for INTEGER, BIGINT, etc.)
 */
class GenericNum extends Type {
    constructor(name, n = 11) {
        super(name);
        this.n = n;
    }

    check(nval) {
        if (typeof nval !== typeof 0) {
            return { success: false, error: 'value should be number!' };
        }
        // TODO: check this.n correctness
        return { success: true };
    }
}

export const Integer = (n, ...directives) => {
    return createColumn('INTEGER', n, GenericNum, directives);
};
export const BigInteger = (n, ...directives) => {
    return createColumn('BIGINT', n, GenericNum, directives);
};
export const Decimal = (n, ...directives) => {
    return createColumn('DECIMAL', n, GenericNum, directives);
};
export const Float = (n, ...directives) => {
    return createColumn('FLOAT', n, GenericNum, directives);
};
export const Double = (n, ...directives) => {
    return createColumn('DOUBLE', n, GenericNum, directives);
};

// aliases
export const Int = Integer;
export const BigInt = BigInteger;
