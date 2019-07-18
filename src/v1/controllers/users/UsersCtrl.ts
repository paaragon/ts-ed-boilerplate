import { Controller, Get, PathParams, Delete, BodyParams, HeaderParams, QueryParams, Post, Put } from '@tsed/common';
import { UsersService } from '../../services/users/UsersService';
import { AuthCheck } from '../../middlewares/auth/AuthCheckDecorator';
import { Roles } from '../../interfaces/users/Roles';
import User from '../../entities/users/User';
import { AuthService } from '../../services/auth/AuthService';
import { TokenPayload } from '../../interfaces/auth/TokenPayload';
import { BadRequest, Unauthorized } from 'ts-httpexceptions';
import { Summary, Security, Description, Returns } from '@tsed/swagger';
import QueryBracketsService from '../../services/querybrackets/QueryBracketsService';
import Filter from '../../interfaces/rest/Filter';
import Order from '../../interfaces/rest/Order';
import swaggerlits from '../../constants/literals/swaggerlits';
import literals from '../../constants/literals/literals';

@Controller('/user')
export class UsersCtrl {

    constructor(
        private usersService: UsersService,
        private authService: AuthService,
        private queryBracketsService: QueryBracketsService
    ) { }

    @Get('/')
    @Summary(swaggerlits.SWAGGER_USES_GET_ALL_SUMMARY)
    @Security('Token User')
    @Description(swaggerlits.SWAGGER_USES_GET_ALL_descRIPTION)
    @Returns(200, { description: swaggerlits.SWAGGER_USES_GET_ALL_descRIPTION })
    @AuthCheck(Roles.USER, Roles.ADMIN)
    public async getAll(
        @Description(swaggerlits.SWAGGER_REST_GET_ALL_PAGE_desc)
        @QueryParams('p') page: number,

        @Description(swaggerlits.SWAGGER_REST_GET_ALL_ELEMENTS_PER_PAGE_desc)
        @QueryParams('pp') elementsPerPage: number,

        @Description(swaggerlits.SWAGGER_REST_GET_ALL_ORDERS_desc)
        @QueryParams('orders') orders: string,

        @Description(swaggerlits.SWAGGER_REST_GET_ALL_FILTERS_desc)
        @QueryParams('filters') filters: string
    ): Promise<User[]> {

        elementsPerPage = elementsPerPage || 50;
        const skip: number = page * elementsPerPage;
        const limit: number = elementsPerPage;
        const filtersParsed: Filter[] = this.queryBracketsService.parseFilters(filters);
        const ordersParsed: Order[] = this.queryBracketsService.parseOrders(orders);

        return await this.usersService.filter(filtersParsed, ordersParsed, skip, limit);
    }

    @Get('/:id')
    @AuthCheck(Roles.USER, Roles.ADMIN)
    public async getById(
        @PathParams('id') id: number
    ): Promise<User> {
        return await this.usersService.findById(id);
    }

    @Post('/')
    @AuthCheck(Roles.ADMIN)
    public async insert(
        @BodyParams('nombre') nombre: string,
        @BodyParams('apellidos') apellidos: string,
        @BodyParams('username') username: string,
        @BodyParams('password') password: string,
        @BodyParams('rol') rol: string
    ): Promise<User> {

        if (!nombre || !apellidos || !username || !password) {
            throw new BadRequest(literals.CREATE_USER_MISSING_PARAMS);
        }

        const user = new User();
        user.nombre = nombre;
        user.apellidos = apellidos;
        user.rol = rol;
        user.username = username;
        user.sal = this.authService.generateSalt();
        user.password = this.authService.encryptPassword(password, user.sal);

        await this.usersService.create(user);

        return await this.usersService.findByUsername(user.username);
    }

    @Put('/:id')
    @AuthCheck(Roles.USER, Roles.ADMIN)
    public async put(
        @PathParams('id') id: number,
        @QueryParams('x-token-decoded') token: TokenPayload,
        @BodyParams('nombre') nombre: string,
        @BodyParams('apellidos') apellidos: string,
        @BodyParams('username') username: string,
        @BodyParams('rol') rol: string,
    ) {
        if (token.rol !== Roles.ADMIN && token.id !== id) {
            throw new Unauthorized(literals.UPDATE_USER_INSUFICENT_PRIVILEGES);
        }

        if (token.rol !== Roles.ADMIN && token.rol !== rol) {
            throw new Unauthorized(literals.UPDATE_USER_ROL_INSUFICENT_PRIVILEGES);
        }

        const user = new User();
        user.id = id;
        user.nombre = nombre;
        user.apellidos = apellidos;
        user.username = username;
        user.rol = rol;

        return this.usersService.updateByPK(user.id, user);
    }

    @Put('/:id/password')
    @AuthCheck(Roles.USER, Roles.ADMIN)
    public async editPassword(
        @PathParams('id') id: number,
        @BodyParams('oldPassword') oldPassword: string,
        @BodyParams('newPassword') newPassword: string,
        @BodyParams('newPasswordRepeat') newPasswordRepeat: string
    ) {

        if (newPassword !== newPasswordRepeat) {
            throw new BadRequest(literals.CHANGE_PASSWORD_WRONG_REPEAT);
        }

        const user: User = await this.usersService.findById(id, true);
        const oldPasswordEnc = await this.authService.encryptPassword(oldPassword, user.sal);
        if (oldPasswordEnc !== user.password) {
            throw new Unauthorized(literals.CURRENT_PASSWORD_INCORRECT);
        }

        const newPasswordEnc = await this.authService.encryptPassword(newPassword, user.sal);
        user.password = newPasswordEnc;
        await this.usersService.updateByPK(id, user, true);

        return user;
    }

    @Delete('/:id')
    @AuthCheck(Roles.ADMIN)
    public async delete(
        @PathParams('id') id: number,
        @QueryParams('x-token-decoded') token: TokenPayload
    ): Promise<{ id: number }> {

        if (token.id === id) {
            throw new BadRequest(literals.DELETING_SELF_USER);
        }
        await this.usersService.deleteById(id);

        return { id };
    }
}