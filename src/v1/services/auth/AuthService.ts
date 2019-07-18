import { Service } from '@tsed/di';
import { TokenResponse } from '../../interfaces/auth/TokenResponse';
import { TokenPayload } from '../../interfaces/auth/TokenPayload';
import literals from '../../constants/literals/literals';
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');
const config = require('config');

const pepper = config.get('auth').pepper;
const tokenSecret = config.get('auth').token.secret;
const tokenExpire = config.get('auth').token.expire;

@Service()
export class AuthService {

    public generateSalt(): string {
        return uuidv4();
    }

    public encryptPassword(password: string, salt: string): string {
        return this.encryptSHA512(password, salt);
    }

    public generateToken(payload: any): string {
        return jwt.sign(payload, tokenSecret, {
            expiresIn: tokenExpire,
        });
    }

    public async verifyToken(token: string, roles: string[]): Promise<TokenResponse> {
        return new Promise<TokenResponse>((resolve, reject) => {
            this.decodeToken(token)
                .then((decoded: TokenPayload) => {
                    if (roles.indexOf(decoded.rol) === -1) {
                        return reject({
                            error: true,
                            errorCode: 401,
                            message: literals.NOT_VALID_ROL
                        });
                    }

                    resolve({
                        error: false,
                        token: decoded
                    });
                })
                .catch(err => {
                    return reject({
                        error: true,
                        errorCode: 400,
                        message: literals.TOKEN_VERIFY_ERROR
                    });
                });
        });
    }

    private async decodeToken(token): Promise<any> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, tokenSecret, (err, decoded: TokenPayload) => {
                if (err) {
                    return reject(err);
                }
                resolve(decoded);
            });
        });
    }

    private encryptSHA512(password, salt): string {
        const hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
        hash.update(password + pepper);
        const value = hash.digest('hex');

        return value;
    }
}