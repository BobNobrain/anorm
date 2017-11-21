import Type from './Type';

/**
 * Class describes a column type that is another entity
 */
export default class ModelType extends Type {
    /**
     * Creates an instance representing this type
     * @param {class extends Model} TModel Custom model class
     */
    constructor(TModel) {
        super(TModel.name);
        this.T = TModel;
    }

    check(value) {
        return value instanceof this.T;
    }
}
