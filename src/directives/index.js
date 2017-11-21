// TODO: index directive
import { Model, assignColumn } from '../Model';
import { Column } from './Column';
import { ArrayOf } from '../types/array';

/**
 * Directive makes relationship be autofetched with model
 */
export const autofetch = to => { to.autofetch = true; }

/**
 * Directive creates a back reference column for relationship
 */
export const backref = (opts, ...directives) => column => {
    let name = opts, multiple;
    if (typeof opts === typeof {}) {
        { name, multiple } = opts;
    }

    const BT = column.type;
    const A = column.model;

    if (typeof multiple !== typeof true) {
        // here we need to guess multiple's value
        // by default, backref creates one-to-many relationships
        if (BT.isArray) {
            // A({ b: ArrayOf(B, backref('a')) })
            // => A.b: B[] => B.a: A
            multiple = false;
        } else {
            // A({ b: B.with( backref('a') ) })
            // => A.b: B => B.a: A[]
            multiple = true;
        }
    }

    const B = BT.isArray? BT.ofType.T : BT.T;

    let backrefCol = null; // B.a
    if (multiple) {
        backrefCol = ArrayOf(A, ...directives);
    } else {
        backrefCol = A.with(...directives);
    }

    // B[name] = Column<A | A[]>
    assignColumn(name, backrefCol, B);

    // provide cross references
    column.backref = backrefCol;
    backrefCol.backref = column;
};

/**
 * Marks column as nullable (or not nullable, if needed)
 * By default, all columns assumed to be not nullable
 * @example
 * Model({ email: Varchar(nullable(false)), name: Varchar(nullable), phone: Varchar(nullable(true)) })
 */
export const nullable = to => {
    if (typeof to === typeof true) {
        return column => { column.nullable = to; };
    } else {
        to.nullable = true;
    }
};

/**
 * Primary key constraint directive
 * If model does not have any column with this directive, an 'id' integer PK field will be created
 * @example
 * Model({ uuid: Char(20, PK) })
 */
export const PK = to => { to.constraints.primary = true; };
export const primary = PK;

/**
 * Unique constraint directive
 * @example
 * Model({ email: Varchar(50, unique) })
 */
export const unique = to => { to.constraints.unique = true; };

/**
 * Overrides table name
 * @example
 * class User extends Model({ ... }, tableName('people')) {}
 */
export const tableName = name => to => {
    to._anorm.tableName = name;
};

/**
 * Overrides column name
 * @example
 * Model({ fullName: Varchar(100, columnName('name')) })
 */
export const columnName = name => to => {
    if (to instanceof Column) {
        to.columnName = name;
    } else {
        throw new TypeError('Directive columnName should be applied to a column!');
    }
}

// TODO
export const isDirective = d => typeof d === typeof Function;
