import { Service } from '@tsed/di';
import { TypeORMService } from '@tsed/typeorm';
import { Connection, EntityMetadata } from 'typeorm';
import { AfterRoutesInit } from '@tsed/common';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import ColumnNotFoundError from '../../exception/rest/ColumnNotFoundException';
import Filter from '../../interfaces/rest/Filter';
import Order from '../../interfaces/rest/Order';
import TypeORMUtils from '../typeormutils/TypeOrmUtils';
import literals from '../../constants/literals/literals';

@Service()
export default class RestService implements AfterRoutesInit {
    private connection: Connection;
    constructor(
        private typeORMService: TypeORMService,
        private typeORMUtils: TypeORMUtils
    ) { }

    $afterRoutesInit(): void | Promise<any> {
        this.connection = this.typeORMService.get();
    }

    public async create(entity, data) {
        await this.connection.manager.save(data);

        return data;
    }

    public async filter(entity, filters: Filter[], orders: Order[], skip: number, limit: number) {

        const metadata: EntityMetadata = this.connection.getMetadata(entity);

        const conditionsObj: any = this.typeORMUtils.buildWhereConditions(metadata, filters, orders, skip, limit);

        return this.connection.manager.find(entity, conditionsObj);
    }

    public async getOne(entity, id) {
        return this.connection.manager.findOne(entity, id);
    }

    public async update(entity, resource) {
        const metadata: EntityMetadata = this.connection.getMetadata(entity);

        for (const c in resource) {
            if (metadata.ownColumns.findIndex((col: ColumnMetadata) => col.propertyName === c) === -1) {
                throw new ColumnNotFoundError(literals.COLUMN_NOT_FOUND + ' ' + c);
            }
        }

        await this.connection.manager.save(resource);

        return resource;
    }

    public async deleteById(entity, key: any): Promise<{ key: any }> {
        await this.connection.manager.delete(entity, key);

        return { key };
    }
}