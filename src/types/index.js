import * as arrs from './array';
import * as date from './date';
import * as nums from './num';
import * as text from './text';

// just reexport all together
export default const types = Object.assign(
    {},
    arrs,
    date,
    nums,
    text
);
