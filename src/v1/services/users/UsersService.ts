import { Service, AfterRoutesInit } from '@tsed/common';
import { TypeORMService } from '@tsed/typeorm';
import { Connection, FindConditions, EntityMetadata } from 'typeorm';
import User from '../../entities/users/User';
import TypeORMUtils from '../typeormutils/TypeOrmUtils';
import Order from '../../interfaces/rest/Order';
import Filter from '../../interfaces/rest/Filter';

const safeColumns: any = ['id', 'nombre', 'apellidos', 'username', 'rol'];

@Service()
export class UsersService implements AfterRoutesInit {
    private connection: Connection;

    constructor(
        private typeORMService: TypeORMService,
        private typeORMUtils: TypeORMUtils
    ) { }

    $afterRoutesInit() {
        this.connection = this.typeORMService.get();
    }

    async create(user: User): Promise<User> {
        await this.connection.manager.save(user);

        return user;
    }

    public async deleteById(key: number): Promise<number> {
        await this.connection.manager.delete(User, key);

        return key;
    }

    async filter(filters: Filter[], orders: Order[], skip: number, limit: number): Promise<User[]> {

        const metadata: EntityMetadata = this.connection.getMetadata(User);
        const conditionsObject: any = this.typeORMUtils.buildWhereConditions(metadata, filters, orders, skip, limit);
        conditionsObject.select = safeColumns;

        return await this.connection.manager.find(User, conditionsObject);
    }

    async findById(id: number, unsafe?: boolean): Promise<User> {

        if (unsafe) {
            return await this.connection.manager.findOne(User, id);
        }

        return await this.connection.manager.findOne(User, id, {
            select: safeColumns
        });
    }

    async findByUsername(username: string, unsafe?: boolean): Promise<User> {
        if (unsafe) {

            return await this.connection.manager.findOne(User, { username });
        }

        return await this.connection.manager.findOne(User, { username }, {
            select: safeColumns
        });
    }

    public async updateByPK(id: number, user: User, unsafe?: boolean): Promise<User> {
        const data: any = {
            nombre: user.nombre,
            apellidos: user.apellidos,
            username: user.username,
            rol: user.rol
        };

        if (unsafe) {
            data.password = user.password;
            data.sal = user.sal;
        }

        await this.connection
            .createQueryBuilder()
            .update(User)
            .set(data)
            .where('id = :id', { id })
            .execute();

        return user;
    }

}