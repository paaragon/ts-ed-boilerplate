import { operators } from '../interfaces/rest/Operator';

const regexp = {
    filtersPattern: `(\\[.*?:(${Object.keys(operators).join('|')}):.*?\\])`,
    ordersPattern: `(\\[.*?:(asc|desc)\\])`,
};

export default regexp;