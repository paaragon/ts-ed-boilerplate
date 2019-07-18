import { Middleware, Next, EndpointMetadata, Request, Response, EndpointInfo, IMiddleware } from '@tsed/common';
import * as Express from 'express';
import { BadRequest, Forbidden } from 'ts-httpexceptions';
import { AuthService } from '../../services/auth/AuthService';
import { TokenResponse } from '../../interfaces/auth/TokenResponse';
import literals from '../../constants/literals/literals';

@Middleware()
export default class AuthCheckMiddleware implements IMiddleware {

    constructor(
        private authService: AuthService
    ) { }

    use(
        @Request() request: Express.Request,
        @EndpointInfo() endpoint: EndpointMetadata
    ): any {
        return new Promise((resolve, reject) => {
            const roles = endpoint.get(AuthCheckMiddleware) || [];
            const token = request.body['x-token'] || request.query['x-token'] || request.headers['x-token'];

            if (!token) {
                reject(new BadRequest(literals.MISSING_TOKEN));
            }
            this.authService.verifyToken(token, roles)
                .then((res: TokenResponse) => {
                    request.query['x-token-decoded'] = res.token;
                    resolve(token);
                })
                .catch((err: TokenResponse) => {
                    const e = new Forbidden(err.message);
                    e.status = err.errorCode;
                    reject(e);
                });
        });
    }
}