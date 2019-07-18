import { TestContext, bootstrap, inject } from '@tsed/testing';
import * as SuperTest from 'supertest';
import { expect } from 'chai';
import { ExpressApplication } from '@tsed/common';
import { UsersService } from 'src/v1/services/users/UsersService';
import { AuthService } from 'src/v1/services/auth/AuthService';
import UserBDInitializer from '../db/UserDBInitializer';
import User from 'src/v1/entities/users/User';
import userMock from '../mocks/user-mock';
import { Roles } from 'src/v1/interfaces/users/Roles';
import literals from 'src/v1/constants/literals/literals';

describe('Users Test Suite', () => {

    let app;
    let user: User;
    let admin: User;
    let thirdUser: User;
    before(inject([ExpressApplication, UsersService, AuthService],
        async (expressApplication: ExpressApplication, userService: UsersService, authService: AuthService) => {
            app = SuperTest(expressApplication);
            const usersDBInitializer = new UserBDInitializer(userService, authService);
            await usersDBInitializer.init();
            user = userMock[0];
            admin = userMock[1];
            thirdUser = userMock[2];
        }));

    after(inject([UsersService, AuthService],
        async (userService: UsersService, authService: AuthService) => {
            const usersDBInitializer = new UserBDInitializer(userService, authService);
            await usersDBInitializer.destroy();
        }));

    let token;
    let tokenAdmin;
    describe('Autenticating', () => {
        it('authenticate with USER', (done) => {
            app.post('/api/v1/auth/authenticate')
                .send({ username: user.username, password: user.password })
                .expect(200)
                .end((err, response) => {
                    if (err) {
                        return done(err);
                    }
                    token = response.body.token;
                    done();
                });
        });

        it('authenticate with ADMIN', (done) => {
            app.post('/api/v1/auth/authenticate')
                .send({ username: admin.username, password: admin.password })
                .expect(200)
                .end((err, response) => {
                    if (err) {
                        return done(err);
                    }
                    tokenAdmin = response.body.token;
                    done();
                });
        });
    });

    describe('GET /api/v1/user', () => {
        it('get all users', (done) => {
            app.get(`/api/v1/user`)
                .set('x-token', token)
                .expect(200)
                .end((err, response: any) => {
                    if (err) {
                        return done(err);
                    }
                    const users: User[] = response.body;
                    expect(users).to.satisfy((obj) => obj && obj.length && obj.length > 0);
                    done();
                });
        });
    });

    describe('GET /api/v1/user/:id', () => {
        it('get one user', (done) => {
            const id = user.id;
            app.get(`/api/v1/user/${id}`)
                .set('x-token', token)
                .expect(200)
                .end((err, response: any) => {
                    if (err) {
                        return done(err);
                    }
                    const user = response.body;
                    expect(user).to.satisfy((obj) => obj && obj.id === 1);
                    done();
                });
        });
    });

    let newUserId;
    describe('POST /api/v1/user', () => {

        it('create with USER rol', (done) => {
            app.post(`/api/v1/user`)
                .set('x-token', token)
                .send({
                    nombre: 'prueba',
                    apellidos: 'probando probando',
                    rol: Roles.USER,
                    username: 'prueba',
                    password: '123'
                })
                .expect(401)
                .end((err, response: any) => {
                    if (err) {
                        return done(err);
                    }
                    expect(response.text).to.be.equals(literals.NOT_VALID_ROL);
                    done();
                });
        });

        it('create with wrong parameters', (done) => {
            app.post(`/api/v1/user`)
                .set('x-token', tokenAdmin)
                .send({
                    nombre: 'prueba',
                    apellidos: 'probando probando',
                    rol: Roles.USER
                })
                .expect(400)
                .end((err, response: any) => {
                    if (err) {
                        return done(err);
                    }
                    expect(response.text).to.be.equals(literals.CREATE_USER_MISSING_PARAMS);
                    done();
                });
        });

        it('create with ADMIN rol', (done) => {
            app.post(`/api/v1/user`)
                .set('x-token', tokenAdmin)
                .send({
                    nombre: 'prueba',
                    apellidos: 'probando probando',
                    rol: Roles.USER,
                    username: 'prueba',
                    password: '123'
                })
                .expect(200)
                .end((err, response: any) => {
                    if (err) {
                        return done(err);
                    }
                    const user: User = response.body;
                    newUserId = user.id;
                    expect(user.id).to.be.greaterThan(0);
                    done();
                });
        });
    });

    describe('PUT /api/v1/user/:id', () => {
        it('update non self user logged with USER rol', (done) => {
            app.put(`/api/v1/user/${thirdUser.id}`)
                .set('x-token', token)
                .send({
                    nombre: thirdUser.nombre + 'updated',
                    apellidos: thirdUser.apellidos,
                    rol: Roles.USER,
                    username: thirdUser.username,
                    password: thirdUser.password
                })
                .expect(401)
                .end((err, response: any) => {
                    if (err) {
                        return done(err);
                    }
                    expect(response.text).to.be.equals(literals.UPDATE_USER_INSUFICENT_PRIVILEGES);
                    done();
                });
        });

        it('update self rol logged with USER rol', (done) => {
            app.put(`/api/v1/user/${user.id}`)
                .set('x-token', token)
                .send({
                    nombre: user.nombre + 'updated',
                    apellidos: user.apellidos,
                    rol: Roles.ADMIN,
                    username: user.username,
                    password: user.password
                })
                .expect(401)
                .end((err, response: any) => {
                    if (err) {
                        return done(err);
                    }
                    expect(response.text).to.be.equals(literals.UPDATE_USER_ROL_INSUFICENT_PRIVILEGES);
                    done();
                });
        });

        it('update self name with USER rol', (done) => {
            const updatedName = user.nombre + 'updated';
            app.put(`/api/v1/user/${user.id}`)
                .set('x-token', token)
                .send({
                    nombre: updatedName,
                    apellidos: user.apellidos,
                    rol: Roles.USER,
                    username: user.username
                })
                .expect(200)
                .end((err, response: any) => {
                    if (err) {
                        return done(err);
                    }
                    const user: User = response.body;
                    expect(user.nombre).to.be.equals(updatedName);
                    done();
                });
        });

        it('check self user name update', (done) => {
            const updatedName = user.nombre + 'updated';
            const id = user.id;
            app.get(`/api/v1/user/${id}`)
                .set('x-token', token)
                .expect(200)
                .end((err, response: any) => {
                    if (err) {
                        return done(err);
                    }
                    const user: User = response.body;
                    expect(user.nombre).to.be.equals(updatedName);
                    done();
                });
        });

        it('update non self user logged with ADMIN rol', (done) => {
            const updatedName = thirdUser.nombre + 'updated';
            app.put(`/api/v1/user/${thirdUser.id}`)
                .set('x-token', tokenAdmin)
                .send({
                    nombre: updatedName,
                    apellidos: thirdUser.apellidos,
                    rol: Roles.ADMIN,
                    username: thirdUser.username,
                    password: thirdUser.password
                })
                .expect(200)
                .end((err, response: any) => {
                    if (err) {
                        return done(err);
                    }
                    const user: User = response.body;
                    expect(user).to.satisfy((user: User) => user.nombre === updatedName && user.rol === Roles.ADMIN);
                    done();
                });
        });

        it('update password wrong repeat', (done) => {
            app.put(`/api/v1/user/${thirdUser.id}/password`)
                .set('x-token', tokenAdmin)
                .send({
                    oldPassword: user.password,
                    newPassword: 'newpassword',
                    newPasswordRepeat: 'newpasswordWrongRepeat',
                })
                .expect(400)
                .end((err, response: any) => {
                    if (err) {
                        return done(err);
                    }
                    expect(response.text).to.be.equals(literals.CHANGE_PASSWORD_WRONG_REPEAT);
                    done();
                });
        });

        it('update password wrong password', (done) => {
            app.put(`/api/v1/user/${thirdUser.id}/password`)
                .set('x-token', tokenAdmin)
                .send({
                    oldPassword: 'invalid password',
                    newPassword: 'newpassword',
                    newPasswordRepeat: 'newpassword',
                })
                .expect(401)
                .end((err, response: any) => {
                    if (err) {
                        return done(err);
                    }
                    expect(response.text).to.be.equals(literals.CURRENT_PASSWORD_INCORRECT);
                    done();
                });
        });

        it('update password', (done) => {
            app.put(`/api/v1/user/${thirdUser.id}/password`)
                .set('x-token', tokenAdmin)
                .send({
                    oldPassword: user.password,
                    newPassword: 'newpassword',
                    newPasswordRepeat: 'newpassword',
                })
                .expect(200)
                .end((err, response: any) => {
                    if (err) {
                        return done(err);
                    }
                    done();
                });
        });

        it('check update password', (done) => {
            app.post('/api/v1/auth/authenticate')
                .send({ username: user.username, password: user.password })
                .expect(200)
                .end((err, response: any) => {
                    if (err) {
                        return done(err);
                    }
                    expect(response.body.token).to.be.not.equals('');
                    done();
                });
        });
    });

    describe('DELETE /api/v1/user/:id', () => {
        it('delete user with USER rol', (done) => {
            const id = user.id;
            app.delete(`/api/v1/user/${id}`)
                .set('x-token', token)
                .expect(401)
                .end((err, response: any) => {
                    if (err) {
                        return done(err);
                    }
                    expect(response.text).to.be.equals(literals.NOT_VALID_ROL);
                    done();
                });
        });

        it('delete self user with ADMIN rol', (done) => {
            app.delete(`/api/v1/user/${admin.id}`)
                .set('x-token', tokenAdmin)
                .expect(400)
                .end((err, response: any) => {
                    if (err) {
                        return done(err);
                    }
                    expect(response.text).to.be.equals(literals.DELETING_SELF_USER);
                    done();
                });
        });

        it('delete non self user with ADMIN rol', (done) => {
            app.delete(`/api/v1/user/${newUserId}`)
                .set('x-token', tokenAdmin)
                .expect(200)
                .end((err, response: any) => {
                    if (err) {
                        return done(err);
                    }
                    const resp = response.body;
                    expect(resp.id).to.be.equals(newUserId);
                    done();
                });
        });
    });
});