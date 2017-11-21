const makeField = (name, type, entity) => {
    entity._anorm[name] = {
        value: null,
        changed: false
    };
    Object.defineProperty(entity, name, {
        configurable: false,
        enumerable: true,
        get() {
            return entity._anorm[name].value;
        },
        set(nval) {
            const { success, error } = type.check(nval);
            if (success) {
                entity._anorm[name].value = nval;
                entity._anorm[name].changed = true;
            } else {
                throw new TypeError(
                    `type check failed for ${entity.constructor.name}.${name} with '${nval}': ${error}`
                );
            }
        }
    })
};

export class Model {
    constructor(values = {}) {
        Object.defineProperty(this, '_anorm', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: {}
        });
        const fields = this.modelInfo.fields;
        for (let fname in fields) {
            if (!fields.hasOwnProperty(fname)) continue;
            makeField(fname, fields[fname], this);
        }
    }

    get modelInfo() {
        return this.constructor._anorm;
    }
}

export function model(fields, ...directives) {
    class Entity extends Model {}
    Entity._anorm = {
        name: null,
        fields
    };

    directives.forEach(d => d.apply(Entity));

    Object.defineProperty(Entity, '_name', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: function _entityName() {
            if (typeof Entity._anorm.name === typeof '') {
                return Entity._anorm.name;
            } else {
                return this.name.toLowerCase();
            }
        }
    });
}
