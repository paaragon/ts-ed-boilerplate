import { Controller, Get, PathParams, Put, BodyParams, Delete, QueryParams, Post } from '@tsed/common';
import RestService from '../../services/rest/RestService';
import { AuthCheck } from '../../middlewares/auth/AuthCheckDecorator';
import { Roles } from '../../interfaces/users/Roles';
import { NotFound, InternalServerError, BadRequest } from 'ts-httpexceptions';
import entities from './entities';
import ColumnNotFoundError from '../../exception/rest/ColumnNotFoundException';
import { Description, Summary, Returns, Security } from '@tsed/swagger';
import OperatorNotFoundException from '../../exception/rest/OperatorNotFoundException';
import QueryBracketsService from '../../services/querybrackets/QueryBracketsService';
import Filter from '../../interfaces/rest/Filter';
import Order from '../../interfaces/rest/Order';
import swaggerlits from '../../constants/literals/swaggerlits';
import literals from '../../constants/literals/literals';
import BadQueryBracketFormatException from '../../exception/queryBrackets/BadQueryBracketFormatException';

@Controller('/rest')
export default class RestCtrl {

    constructor(
        private restService: RestService,
        private queryBracketsService: QueryBracketsService
    ) { }

    @Get('/:resource')
    @Summary(swaggerlits.SWAGGER_REST_GET_ALL_SUMMARY)
    @Security('Token User')
    @Description(swaggerlits.SWAGGER_REST_GET_ALL_descRIPTION)
    @Returns(200, { description: swaggerlits.SWAGGER_REST_GET_ALL_200_descRIPTION })
    @Returns(400, { description: swaggerlits.SWAGGER_REST_GET_ALL_400_descRIPTION })
    @Returns(404, { description: swaggerlits.SWAGGER_REST_GET_ALL_404_descRIPTION })
    @AuthCheck(Roles.USER, Roles.ADMIN)
    public async getAll(
        @Description(swaggerlits.SWAGGER_REST_GET_ALL_OBJECT_TYPE_desc)
        @PathParams('resource') objectType: string,

        @Description(swaggerlits.SWAGGER_REST_GET_ALL_PAGE_desc)
        @QueryParams('p') page: number,

        @Description(swaggerlits.SWAGGER_REST_GET_ALL_ELEMENTS_PER_PAGE_desc)
        @QueryParams('pp') elementsPerPage: number,

        @Description(swaggerlits.SWAGGER_REST_GET_ALL_ORDERS_desc)
        @QueryParams('orders') orders: string,

        @Description(swaggerlits.SWAGGER_REST_GET_ALL_FILTERS_desc)
        @QueryParams('filters') filters: string
    ) {
        if (!entities[objectType]) {
            throw new NotFound(literals.RESOURCE_NOT_FOUND);
        }

        const entity = entities[objectType];
        elementsPerPage = elementsPerPage || 50;
        const skip: number = page * elementsPerPage;
        const limit: number = elementsPerPage;

        try {
            const filtersParsed: Filter[] = this.queryBracketsService.parseFilters(filters);
            const ordersParsed: Order[] = this.queryBracketsService.parseOrders(orders);

            const filteredResources = await this.restService.filter(entity, filtersParsed, ordersParsed, skip, limit);

            return filteredResources;
        } catch (e) {
            if (e instanceof ColumnNotFoundError
                || e instanceof OperatorNotFoundException
            || e instanceof BadQueryBracketFormatException) {
                throw new BadRequest(e.message);
            } else {
                throw new InternalServerError(e);
            }
        }
    }

    @Get('/:resource/:key')
    @Summary(swaggerlits.SWAGGER_REST_GET_ONE_SUMMARY)
    @Security('Token User')
    @Description(swaggerlits.SWAGGER_REST_GET_ONE_descRIPTION)
    @Returns(200, { description: swaggerlits.SWAGGER_REST_GET_ONE_200_descRIPTION })
    @Returns(404, { description: swaggerlits.SWAGGER_REST_GET_ONE_404_descRIPTION })
    @AuthCheck(Roles.USER, Roles.ADMIN)
    public async getOne(
        @Description(swaggerlits.SWAGGER_REST_GET_ONE_OBJECT_TYPE_desc)
        @PathParams('resource') objectType: string,

        @Description(swaggerlits.SWAGGER_REST_GET_ONE_KEY_desc)
        @PathParams('key') key: any
    ) {
        if (!entities[objectType]) {
            throw new NotFound(literals.RESOURCE_NOT_FOUND);
        }

        const entity = await this.restService.getOne(entities[objectType], key);

        if (!entity) {
            throw new NotFound(literals.RESOURCE_NOT_FOUND);
        }

        return entity;
    }

    @Post('/:resource')
    @Summary(swaggerlits.SWAGGER_REST_CREATE_SUMMARY)
    @Security('Token User')
    @Description(swaggerlits.SWAGGER_REST_CREATE_descRIPTION)
    @Returns(200, { description: swaggerlits.SWAGGER_REST_CREATE_200_descRIPTION })
    @Returns(400, { description: swaggerlits.SWAGGER_REST_CREATE_400_descRIPTION })
    @Returns(404, { description: swaggerlits.SWAGGER_REST_CREATE_404_descRIPTION })
    @AuthCheck(Roles.USER, Roles.ADMIN)
    public async create(
        @Description(swaggerlits.SWAGGER_REST_CREATE_OBJECT_TYPE_desc)
        @PathParams('resource') objectType: string,

        @Description(swaggerlits.SWAGGER_REST_CREATE_BODY_desc)
        @BodyParams() body: any
    ) {
        if (!entities[objectType]) {
            throw new NotFound(literals.RESOURCE_NOT_FOUND);
        }

        if (!body || Object.keys(body).length === 0) {
            throw new BadRequest(literals.CREATE_DATA_NOT_FOUND);
        }

        const entity = new entities[objectType](...Object.keys(body).map(key => body[key]));

        return await this.restService.create(entities[objectType], entity);
    }

    @Put('/:resource/:key')
    @Summary(swaggerlits.SWAGGER_REST_EDIT_SUMMARY)
    @Security('Token User')
    @Description(swaggerlits.SWAGGER_REST_EDIT_descRIPTION)
    @Returns(200, { description: swaggerlits.SWAGGER_REST_EDIT_200_descRIPTION })
    @Returns(400, { description: swaggerlits.SWAGGER_REST_EDIT_400_descRIPTION })
    @Returns(404, { description: swaggerlits.SWAGGER_REST_EDIT_404_descRIPTION })
    @AuthCheck(Roles.USER, Roles.ADMIN)
    public async edit(
        @Description(swaggerlits.SWAGGER_REST_EDIT_OBJECT_TYPE_desc)
        @PathParams('resource') objectType: string,

        @Description(swaggerlits.SWAGGER_REST_EDIT_KEY_desc)
        @PathParams('key') key: any,

        @Description(swaggerlits.SWAGGER_REST_EDIT_BODY_desc)
        @BodyParams() body: any
    ) {
        if (!entities[objectType]) {
            throw new NotFound(literals.RESOURCE_NOT_FOUND);
        }

        if (!body || Object.keys(body).length === 0) {
            throw new BadRequest(literals.UPDATE_DATA_NOT_FOUND);
        }

        const entity = await this.restService.getOne(entities[objectType], key);

        if (!entity) {
            throw new NotFound(literals.RESOURCE_NOT_FOUND);
        }

        for (const data in body) {
            entity[data] = body[data];
        }

        try {
            return await this.restService.update(entities[objectType], entity);
        } catch (e) {
            if (e instanceof ColumnNotFoundError) {
                throw new BadRequest(e.message);
            } else {
                throw new InternalServerError(e);
            }
        }
    }

    @Delete('/:resource/:key')
    @Summary(swaggerlits.SWAGGER_REST_DELETE_SUMMARY)
    @Security('Token User')
    @Description(swaggerlits.SWAGGER_REST_DELETE_descRIPTION)
    @Returns(200, { description: swaggerlits.SWAGGER_REST_DELETE_200_descRIPTION })
    @Returns(400, { description: swaggerlits.SWAGGER_REST_EDIT_400_descRIPTION })
    @Returns(404, { description: swaggerlits.SWAGGER_REST_DELETE_404_descRIPTION })
    @AuthCheck(Roles.USER, Roles.ADMIN)
    public async delete(
        @Description(swaggerlits.SWAGGER_REST_DELETE_OBJECT_TYPE_desc)
        @PathParams('resource') objectType: string,

        @Description(swaggerlits.SWAGGER_REST_DELETE_KEY_desc)
        @PathParams('key') key: any
    ) {
        if (!entities[objectType]) {
            throw new NotFound(literals.RESOURCE_NOT_FOUND);
        }

        return await this.restService.deleteById(entities[objectType], key);
    }
}