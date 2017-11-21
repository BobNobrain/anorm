import { snake } from 'change-case';
import Column from './Column';
import ModelType from './types/ModelType';
import { apply } from './directives';

/**
 * Helper: assigns column property to model
 * @param  {String}              colName Column name
 * @param  {Column}              column  Column itself
 * @param  {class extends Model} Entity  a class extending model
 */
const assignColumn = (colName, column, Entity) => {
    Object.defineProperty(Entity, colName, {
        configurable: false,
        enumerable: true,
        writable: false,
        value: column
    });
};

/**
 * Helper: assigns property to a Model instance
 * @param  {String} name           Column name
 * @param  {Column} column         Column represented by this prop
 * @param  {Model}  entityInstance the instance
 */
const makeProp = (name, column, entityInstance) => {
    // actual data is stored in myObj._anorm object
    Object.defineProperty(entityInstance._anorm, name, {
        configurable: false,
        enumerable: true,
        writable: true,
        value: {
            value: null,
            changed: false
        };
    });

    // and on the object itself we create getter and setter
    Object.defineProperty(entityInstance, name, {
        configurable: false,
        enumerable: true,
        get() {
            return entityInstance._anorm[name].value;
        },
        set(nval) {
            const { success, error } = column.type.check(nval);
            if (success) {
                entityInstance._anorm[name].value = nval;
                entityInstance._anorm[name].changed = true;
            } else {
                throw new TypeError(
                    `type check failed for ${entityInstance.constructor.name}.${name} with '${nval}': ${error}`
                );
            }
        }
    });
};

/**
 * Generic Model class, represents a table in DB
 * All user-defined models will inherit from it.
 */
export class Model {
    constructor(values = {}) {
        // actual data storage
        Object.defineProperty(this, '_anorm', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: {}
        });

        const columns = this.modelInfo.columns;
        for (let colName in columns) {
            if (!columns.hasOwnProperty(colName)) continue;
            // define getter and setter for each column
            makeProp(colName, columns[colName], this);

            // if a value for this prop is given, assign it
            if (colName in values) {
                // type check involved
                this[colName] = values[colName];
            }
        }
    }

    /**
     * Simple getter for model meta information
     * @return {Object} containing info about all columns of a model
     */
    get modelInfo() {
        return this.constructor._anorm;
    }
}

/**
 * This function is used to easily apply directives to columns that are relationships
 * @param  {Directive[]} directives Directives to apply to the column
 * @return {Column}                 Created column with directives
 */
Model.with = function (...directives) {
    return new Column(new ModelType(this), ...directives);
};

/**
 * Function that shortens description of custom Model
 * @param  {Object[Column]}      columns    Hash describing model's properties
 * @param  {...Directive}        directives Directives to apply to a model
 * @return {class extends Model}            to extend it by user-defined model
 */
export function model(columns, ...directives) {
    class Entity extends Model {}
    Entity._anorm = {
        tableName: null,
        columns
    };

    // `class User extends model(...)`, and then `User._tableName()` will give us
    // name of the table associated with this model
    Object.defineProperty(Entity, '_tableName', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: function _tableName() {
            if (typeof Entity._anorm.tableName !== typeof '') {
                // if called on real model, here this will point
                // on some class extending that Entity class, and
                // his 'name' prop will be set by js runtime
                Entity._anorm.tableName = snake(this.name);
            }
            return Entity._anorm.tableName;
        }
    });

    // apply all directives
    apply(directives, Entity);

    // create getters and setters for all columns in this model
    for (let colName in columns) {
        if (!columns.hasOwnProperty(colName)) continue;
        let column = columns[colName];

        if (column instanceof Model) {
            // that can be if someone set smth like
            // `..., owner: User, ...` in columns description
            // just convert it to a column
            column = new Column(new ModelType(column));
        }

        // end column initialization
        column.finish(colName);

        // add it to the model
        assignColumn(colName, column, Entity);
    }

    // here we go, return our upgraded class
    return Entity;
}
