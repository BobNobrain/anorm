import Type from './Type';
import { apply } from '../directives';

export const ArrayOf = (type, ...directives) => {
    const t = new Type(type + '[]');
    t.isArray = true;
    t.itemType = type;
    apply(directives, t);
    return t;
};
