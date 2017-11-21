import { snake } from 'change-case';
import { apply } from './directives';

export default class Column {
    constructor(type, ...directives) {
        this.type = type;
        this.name = null;
        this.columnName = null; // in db
        this.model = null;

        this.autoFetch = false;
        // this.backref = null;
        this.constraints = { unique: false, primary: false };
        this.indexes = [];
        this.nullable = false;

        this.directives = directives;
        this._created = false;
    }

    finish(name) {
        this.name = name;
        this.columnName = snake(name);
        apply(this.directives, this);
        this._created = true;
    }
}
