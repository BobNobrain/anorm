import Type from './Type';
import { isDirective, apply } from '../directives';

class GenericString extends Type {
    constructor(name, n, directives) {
        super(name);
        if (!isDirective(n)) {
            this.n = n;
        } else {
            this.n = 50;
            directives.unshift(n);
        }
        this.name += '(' + n + ')';
        apply(directives, this);
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
    return new GenericString('VARCHAR', n, directives);
};

export const Char = (n, ...directives) => {
    return new GenericString('CHAR', n, directives);
};

export const TString = Varchar;
export const Text = Varchar; // TODO: use mb some specific TEXT types?
