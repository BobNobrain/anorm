import { isDirective } from '../directives';
import Column from '../Column';

/**
 * Helper: used mostly to check if n is directive or not and call appropriate constructor
 * @param  {String}             typeString e.g. 'CHAR' or 'VARCHAR'
 * @param  {Number|Directive}   n          number or directive
 * @param  {class extends Type} TN         constructor that accepts typeString and optional n param
 * @param  {Directive[]}        directives directives to apply
 * @return {Column}                        instance of column with directives applied
 */
export default const createColumn = (typeString, n, TN, directives) => {
    if (isDirective(n)) {
        return new Column(
            new TN(
                typeString
            ),
            n, // is directive too
            ...directives
        );
    } else {
        return new Column(
            new TN(
                typeString,
                n // not a directive but a number, e.g. CHAR(n)
            ),
            ...directives
        );
    }
}
