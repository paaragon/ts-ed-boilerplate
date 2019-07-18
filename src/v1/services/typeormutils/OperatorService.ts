import { FindOperator } from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { Service } from '@tsed/di';
import Filter from '../../interfaces/rest/Filter';
import { operators } from '../../interfaces/rest/Operator';
import ColumnNotFoundError from '../../exception/rest/ColumnNotFoundException';
import literals from '../../constants/literals/literals';

@Service()
export default class OperatorService {
    public getTypeOrmOperator(columns: ColumnMetadata[], filter: Filter): FindOperator<any> {
        for (const column of columns) {
            if (column.propertyName === filter.name) {
                const columnParse: any = column.type;
                const value: any = columnParse(filter.value);

                return operators[filter.operator](value);
            }
        }

        throw new ColumnNotFoundError(literals.COLUMN_NOT_FOUND + ' ' + filter.name);
    }
}