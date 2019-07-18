import { Service } from '@tsed/di';
import Filter from '../../interfaces/rest/Filter';
import QueryBracketsParser from './QueryBracketsParser';
import { Operator } from '../../interfaces/rest/Operator';
import Order from '../../interfaces/rest/Order';
import OperatorNotFoundException from '../../exception/rest/OperatorNotFoundException';
import regexp from '../../constants/regexp';
import literals from '../../constants/literals/literals';

@Service()
export default class QueryBracketsService {

    constructor(
        private queryBracketsParser: QueryBracketsParser
    ) { }

    public parseFilters(filtersStr: string): Filter[] {

        const params: any[] = this.queryBracketsParser.parseQueryBracketsParam(filtersStr, regexp.filtersPattern);

        if (!params) {
            return null;
        }

        return params.map((param: any[]) => ({
            name: param[0],
            operator: this.getOperator(param[1]),
            value: param[2].replace(/\+/, ' ')
        }));
    }

    public parseOrders(ordersStr: string): Order[] {

        const params: any[] = this.queryBracketsParser.parseQueryBracketsParam(ordersStr, regexp.ordersPattern);

        if (!params) {
            return null;
        }


        return params.map((param: any[]) => ({
            name: param[0],
            direction: param[1]
        }));
    }

    private getOperator(str: string): Operator {
        for (const o in Operator) {
            if (Operator[o] === str) {
                return str as Operator;
            }
        }

        throw new OperatorNotFoundException(literals.OPERATOR_NOT_FOUND);
    }
}