import Type from './Type';
import createColumn from './helpers';

/**
 * Generic string type (for CHAR, VARCHAR, etc.)
 */
class GenericString extends Type {
    constructor(name, n = 50) {
        super(name);
        this.n = n;
    }

    check(nval) {
        if (typeof nval !== typeof '') {
            return { success: false, error: 'value should be string!' };
        }
        if (nval.length > this.n) {
            return { success: false, error: `value should not be longer than ${this.n} chars!` };
        }
        return { success: true };
    }
}

export const Varchar = (n, ...directives) => {
    return createColumn('VARCHAR', n, GenericString, directives);
};

export const Char = (n, ...directives) => {
    return createColumn('CHAR', n, GenericString, directives);
};

// aliases
export const TString = Varchar;
export const Text = Varchar; // TODO: use mb some specific TEXT types?
