import { Like, LessThan, MoreThan, LessThanOrEqual, MoreThanOrEqual, Equal } from 'typeorm';
export enum Operator {
    EQ = 'eq',
    LT = 'lt',
    GT = 'gt',
    LTE = 'lte',
    GTE = 'gte',
    LIKE = 'like'
}

export const operators = {
    eq: Equal,
    lt: LessThan,
    gt: MoreThan,
    lte: LessThanOrEqual,
    gte: MoreThanOrEqual,
    like: Like
};