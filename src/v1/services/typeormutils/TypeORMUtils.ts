import { Service } from '@tsed/di';
import { EntityMetadata } from 'typeorm';
import Filter from '../../interfaces/rest/Filter';
import Order from '../../interfaces/rest/Order';
import ColumnNotFoundError from '../../exception/rest/ColumnNotFoundException';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import OperatorService from './OperatorService';
import literals from '../../constants/literals/literals';

@Service()
export default class TypeORMUtils {

    constructor(
        private operatorService: OperatorService
    ) { }

    public buildWhereConditions(entityMetadata: EntityMetadata, filters?: Filter[], orders?: Order[], skip?: number, limit?: number): any {

        const conditionsObj: any = {};

        if (filters) {
            conditionsObj.where = {};
            for (const filter of filters) {
                conditionsObj.where[filter.name] = this.operatorService.getTypeOrmOperator(entityMetadata.ownColumns, filter);
            }
        }

        if (orders) {
            conditionsObj.order = {};
            for (const order of orders) {
                if (entityMetadata.ownColumns.findIndex((col: ColumnMetadata) => col.propertyName === order.name) === -1) {
                    throw new ColumnNotFoundError(literals.COLUMN_NOT_FOUND + ' ' + order.name);
                } else {
                    conditionsObj.order[order.name] = order.direction;
                }
            }
        }

        if (skip) {
            conditionsObj.skip = skip;
        }

        if (limit) {
            conditionsObj.take = limit;
        }

        return conditionsObj;
    }
}