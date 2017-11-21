import Type from './Type';
import Column from '../Column';

class DateType extends Type {
    constructor(name, useTime) {
        super(name);
        this.useTime = useTime;
    }

    check(value) {
        if (value instanceof Date) {
            if (Number.isNaN(value.getTime())) {
                return { success: false, error: 'date should be valid!' };
            } else {
                return { success: true };
            }
        }
        return { success: false, error: 'value should be a date!' };
    }

    equals(anotherDateType) {
        return super.equals(anotherDateType)
            && (anotherDateType instanceof DateType)
            && (anotherDateType.useTime === this.useTime);
    }
}

export const TDate = (...directives) => {
    return new Column(new DateType('Date', false), ...directives);
};
export const DateTime = (...directives) => {
    return new Column(new DateType('DateTime', true), ...directives);
};
