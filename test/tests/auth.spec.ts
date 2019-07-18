import { TestContext, bootstrap, inject } from '@tsed/testing';
import * as SuperTest from 'supertest';
import { expect } from 'chai';
import { ExpressApplication } from '@tsed/common';
import { UsersService } from 'src/v1/services/users/UsersService';
import { AuthService } from 'src/v1/services/auth/AuthService';
import UserBDInitializer from '../db/UserDBInitializer';
import User from 'src/v1/entities/users/User';
import userMock from '../mocks/user-mock';

describe('Auth Test Suite', () => {
    let app;
    let user: User;
    let admin: User;
    before(inject([ExpressApplication, UsersService, AuthService],
        async (expressApplication: ExpressApplication, userService: UsersService, authService: AuthService) => {
            app = SuperTest(expressApplication);
            const usersDBInitializer = new UserBDInitializer(userService, authService);
            await usersDBInitializer.init();
            user = userMock[0];
            admin = userMock[1];
        }));

    after(inject([UsersService, AuthService],
        async (userService: UsersService, authService: AuthService) => {
            const usersDBInitializer = new UserBDInitializer(userService, authService);
            await usersDBInitializer.destroy();
        }));

    it('authenticate without username nor password', (done) => {
        app.post('/api/v1/auth/authenticate')
            .send({})
            .expect(400)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }
                expect(response.text).to.be.equals('Faltan parametros');
                done();
            });
    });

    it('authenticate with non-existent username', (done) => {
        app.post('/api/v1/auth/authenticate')
            .send({ username: 'totalmenteinventado', password: 'asdf' })
            .expect(401)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }
                expect(response.text).to.be.equals('Credenciales incorrectas');
                done();
            });
    });

    it('authenticate with wrong password', (done) => {
        app.post('/api/v1/auth/authenticate')
            .send({ username: user.username, password: 'totalmenteinventado' })
            .expect(401)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }
                expect(response.text).to.be.equals('Credenciales incorrectas');
                done();
            });
    });

    it('authenticate with USER', (done) => {
        app.post('/api/v1/auth/authenticate')
            .send({ username: user.username, password: user.password })
            .expect(200)
            .end((err, response) => {
                if (err) {
                    return done(err);
                }
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
                done();
            });
    });

    it('random request without token', (done) => {
        app.get(`/api/v1/rest/yaml`)
            .expect(400)
            .end((err, response: any) => {
                if (err) {
                    return done(err);
                }
                expect(response.text).to.be.equals('No se encuentra un token');
                done();
            });
    });
});