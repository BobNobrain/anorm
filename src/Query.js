import Repo from './Repo';
import { and } from './operators';


export default class Query {
    constructor() {
        this._repo = Repo.default;
        this._where = true;
        this._columns = false;
        this._from = [];
        this._orderBy = null;
        this._limit = false;
        this._offset = false;
    }

    from(...models) {
        this._from = models;
        return this;
    }

    select(...columns) {
        if (columns[0] === '*') {
            this._columns = false;
        } else {
            this._columns = columns;
        }
        return this;
    }

    where(condition) {
        this._where = and(this._where, condition);
        return this;
    }
    filter(condition) {
        return this.where(condition);
    }

    orderBy(order) {
        this._orderBy = order;
        return this;
    }
    limit(limit, offset) {
        if (limit === +Infinity) {
            this._limit = false;
        } else {
            this._limit = limit;
        }

        if (typeof offset === typeof 0) {
            this._offset = offset;
        }
        return this;
    }
    offset(value) {
        this._offset = value;
        return this;
    }


    //
    // terminating methods
    //

    /**
     * @async
     * Fetches all records and return them as array
     * @return {Promise<Array>} fetched entities
     */
    all() {
        return this._repo.fetch(this);
    }
    one() {
        this._limit = 1;
        return this._repo.fetch(this)
            .then(entities => {
                if (entities.length) {
                    return entities[0];
                } else {
                    return null;
                }
            });
    }
}
