import { Controller, Post, BodyParams } from '@tsed/common';
import { BadRequest, Unauthorized } from 'ts-httpexceptions';
import { AuthService } from '../../services/auth/AuthService';
import { UsersService } from '../../services/users/UsersService';
import User from '../../entities/users/User';
import { AuthResponse } from '../../interfaces/auth/AuthResponse';
import { TokenPayload } from '../../interfaces/auth/TokenPayload';
import { Summary, Description, Returns } from '@tsed/swagger';
import swaggerlits from '../../constants/literals/swaggerlits';
import literals from '../../constants/literals/literals';

@Controller('/auth')
export class AuthCtrl {

    constructor(
        private authService: AuthService,
        private usersService: UsersService
    ) { }

    @Post('/authenticate')
    @Summary(swaggerlits.SWAGGER_AUTH_AUTHENTICATE_SUMMARY)
    @Description(swaggerlits.SWAGGER_AUTH_AUTHENTICATE_descRIPTION)
    @Returns(200, { description: swaggerlits.SWAGGER_AUTH_AUTHENTICATE_200_descRIPTION })
    @Returns(400, { description: swaggerlits.SWAGGER_AUTH_AUTHENTICATE_400_descRIPTION })
    @Returns(401, { description: swaggerlits.SWAGGER_AUTH_AUTHENTICATE_401_descRIPTION })
    public async authenticate(
        @Description(swaggerlits.SWAGGER_AUTH_AUTHENTICATE_USERNAME_desc)
        @BodyParams('username') username: string,

        @Description(swaggerlits.SWAGGER_AUTH_AUTHENTICATE_PASSWORD_desc)
        @BodyParams('password') password: string
    ): Promise<AuthResponse> {
        if (!username || !password) {
            throw (new BadRequest(literals.FALTAN_PARAMETROS));
        }
        // recogemos el usuario de base de datos
        const user: User = await this.usersService.findByUsername(username, true);
        if (!user) { // si no existe devolvemos error
            throw (new Unauthorized(literals.CREDENCIALES_INCORRECTAS));
        }
        // encriptamos la contrasena proporcionada
        const encryptedPassword = this.authService.encryptPassword(password, user.sal);
        // si no coinciden, decolvemos error
        if (encryptedPassword !== user.password) {
            throw (new Unauthorized(literals.CREDENCIALES_INCORRECTAS));
        }
        // generamos el token
        const payload: TokenPayload = {
            nombre: user.nombre,
            apellidos: user.apellidos,
            username: user.username,
            rol: user.rol,
            id: user.id
        };

        const token: string = this.authService.generateToken(payload);

        // devolvemos la respuesta
        return {
            rol: user.rol,
            username: user.username,
            id: user.id,
            token
        };
    }
}