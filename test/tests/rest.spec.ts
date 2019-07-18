import { inject } from '@tsed/testing';
import * as SuperTest from 'supertest';
import { expect } from 'chai';
import { ExpressApplication } from '@tsed/common';
import { UsersService } from 'src/v1/services/users/UsersService';
import { AuthService } from 'src/v1/services/auth/AuthService';
import UserBDInitializer from '../db/UserDBInitializer';
import User from 'src/v1/entities/users/User';
import userMock from '../mocks/user-mock';
import RestService from 'src/v1/services/rest/RestService';
import literals from 'src/v1/constants/literals/literals';
import regexp from 'src/v1/constants/regexp';
import CMSLiteralsBDInitializer from '../db/CMSLiteralsDBInitializer';

describe('Rest suite', () => {

    let app;
    let user: User;
    let usersDBInitializer: UserBDInitializer;
    let cmsLiteralsDBInitializer: CMSLiteralsBDInitializer;
    before(inject([RestService, ExpressApplication, UsersService, AuthService],
        async (restService: RestService, expressApplication: ExpressApplication, userService: UsersService, authService: AuthService) => {
            app = SuperTest(expressApplication);
            usersDBInitializer = new UserBDInitializer(userService, authService);
            cmsLiteralsDBInitializer = new CMSLiteralsBDInitializer(restService);
            await usersDBInitializer.init();
            await cmsLiteralsDBInitializer.init();
            user = userMock[0];
        }));

    after(inject([RestService, UsersService, AuthService],
        async (restService: RestService, userService: UsersService, authService: AuthService) => {
            usersDBInitializer = new UserBDInitializer(userService, authService);
            cmsLiteralsDBInitializer = new CMSLiteralsBDInitializer(restService);
            await usersDBInitializer.destroy();
            await cmsLiteralsDBInitializer.destroy();
        }));

    let token;
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
    });

    describe('GET /api/v1/rest/:objectType', () => {
        it('get resource not found', (done) => {
            app.get(`/api/v1/rest/foo`)
                .set('x-token', token)
                .expect(404)
                .end((err, response) => {
                    if (err) {
                        return done(err);
                    }
                    expect(response.text).to.be.equals(literals.RESOURCE_NOT_FOUND);
                    done();
                });
        });
        it('get wrong order column', (done) => {
            app.get(`/api/v1/rest/cms-literals?p=1&orders=[foo:asc]`)
                .set('x-token', token)
                .expect(400)
                .end((err, response) => {
                    if (err) {
                        return done(err);
                    }
                    expect(response.text).to.be.equals(literals.COLUMN_NOT_FOUND + ' foo');
                    done();
                });
        });
        it('get wrong order direction format', (done) => {
            app.get(`/api/v1/rest/cms-literals?p=1&orders=[key:foo]`)
                .set('x-token', token)
                .expect(400)
                .end((err, response) => {
                    if (err) {
                        return done(err);
                    }
                    expect(response.text).to.be.equals(`${literals.BRACKET_QUERY_WRONG_FORMAT}. RegExp: ${regexp.ordersPattern}`);
                    done();
                });
        });
        it('get wrong filter column', (done) => {
            app.get(`/api/v1/rest/cms-literals?p=1&pp=3&orders=[key:asc]&filters=[foo:eq:1][value:like:%numero 0%]`)
                .set('x-token', token)
                .expect(400)
                .end((err, response) => {
                    if (err) {
                        return done(err);
                    }
                    expect(response.text).to.be.equals(literals.COLUMN_NOT_FOUND + ' foo');
                    done();
                });
        });
        it('get wrong operator', (done) => {
            app.get(`/api/v1/rest/cms-literals?p=0&pp=3&orders=[key:asc]&filters=[key:foo:probando.0.app][value:like:%numero+0%]`)
                .set('x-token', token)
                .expect(400)
                .end((err, response) => {
                    if (err) {
                        return done(err);
                    }
                    expect(response.text).to.be.equal(literals.OPERATOR_NOT_FOUND);
                    done();
                });
        });
        it('get filtered resources', (done) => {
            app.get(`/api/v1/rest/cms-literals?p=0&pp=3&orders=[key:asc]&filters=[key:eq:probando.0.app][value:like:%numero+0%]`)
                .set('x-token', token)
                .expect(200)
                .end((err, response) => {
                    if (err) {
                        return done(err);
                    }
                    expect(response.body[0].key).to.be.equals('probando.0.app');
                    done();
                });
        });
        it('get pagination with 3 elements', (done) => {
            app.get(`/api/v1/rest/cms-literals?p=1&pp=3&orders=[key:desc]`)
                .set('x-token', token)
                .expect(200)
                .end((err, response) => {
                    if (err) {
                        return done(err);
                    }
                    expect(response.body.length).to.be.equals(3);
                    done();
                });
        });
    });
    describe('GET /api/v1/rest/:objectType/:id', () => {
        it('get one resource', (done) => {
            app.get(`/api/v1/rest/cms-literals/probando.0.app`)
                .set('x-token', token)
                .expect(200)
                .end((err, response) => {
                    if (err) {
                        return done(err);
                    }
                    expect(response.body.key).to.be.equals('probando.0.app');
                    done();
                });
        });
        it('get one resource not found', (done) => {
            app.get(`/api/v1/rest/cms-literals/foo`)
                .set('x-token', token)
                .expect(404)
                .end((err, response) => {
                    if (err) {
                        return done(err);
                    }
                    expect(response.text).to.be.equals(literals.RESOURCE_NOT_FOUND);
                    done();
                });
        });
    });
    describe('POST /api/v1/rest/:objectType/:id', () => {
        it('Create resource without data', (done) => {
            app.post(`/api/v1/rest/foo`)
                .set('x-token', token)
                .expect(404)
                .end((err, response) => {
                    if (err) {
                        return done(err);
                    }
                    expect(response.text).to.be.equals(literals.RESOURCE_NOT_FOUND);
                    done();
                });
        });
        it('Create resource with empty data', (done) => {
            app.post(`/api/v1/rest/cms-literals`)
                .set('x-token', token)
                .expect(400)
                .end((err, response) => {
                    if (err) {
                        return done(err);
                    }
                    expect(response.text).to.be.equals(literals.CREATE_DATA_NOT_FOUND);
                    done();
                });
        });
        it('Create resource', (done) => {
            app.post(`/api/v1/rest/cms-literals`)
                .set('x-token', token)
                .send({
                    key: 'prueba test',
                    value: 'probando el test',
                    category: 'faq'
                })
                .expect(200)
                .end((err, response) => {
                    if (err) {
                        return done(err);
                    }
                    expect(response.body.key).to.be.equals('prueba test');
                    done();
                });
        });
        it('Check create resource', (done) => {
            app.get(`/api/v1/rest/cms-literals/prueba test`)
                .set('x-token', token)
                .expect(200)
                .end((err, response) => {
                    if (err) {
                        return done(err);
                    }
                    expect(response.body.key).to.be.equals('prueba test');
                    done();
                });
        });
    });
    describe('PUT /api/v1/rest/:objectType/:id', () => {
        it('update without data', (done) => {
            app.put(`/api/v1/rest/cms-literals/probando.0.app`)
                .set('x-token', token)
                .expect(400)
                .end((err, response) => {
                    if (err) {
                        return done(err);
                    }
                    expect(response.text).to.be.equals(literals.UPDATE_DATA_NOT_FOUND);
                    done();
                });
        });
        it('update with empty body', (done) => {
            app.put(`/api/v1/rest/cms-literals/probando.0.app`)
                .set('x-token', token)
                .send({})
                .expect(400)
                .end((err, response) => {
                    if (err) {
                        return done(err);
                    }
                    expect(response.text).to.be.equals(literals.UPDATE_DATA_NOT_FOUND);
                    done();
                });
        });
        it('update with wrong parameters', (done) => {
            app.put(`/api/v1/rest/cms-literals/probando.0.app`)
                .set('x-token', token)
                .send({ foo: 'foo' })
                .expect(400)
                .end((err, response) => {
                    if (err) {
                        return done(err);
                    }
                    expect(response.text).to.be.equals(literals.COLUMN_NOT_FOUND + ' foo');
                    done();
                });
        });
        it('update resource not found (1)', (done) => {
            app.put(`/api/v1/rest/fop/foo`)
                .set('x-token', token)
                .expect(404)
                .end((err, response) => {
                    if (err) {
                        return done(err);
                    }
                    expect(response.text).to.be.equals(literals.RESOURCE_NOT_FOUND);
                    done();
                });
        });
        it('update resource not found (2)', (done) => {
            app.put(`/api/v1/rest/cms-literals/foo`)
                .set('x-token', token)
                .send({ value: 'updated' })
                .expect(404)
                .end((err, response) => {
                    if (err) {
                        return done(err);
                    }
                    expect(response.text).to.be.equals(literals.RESOURCE_NOT_FOUND);
                    done();
                });
        });
        it('update resource', (done) => {
            app.put(`/api/v1/rest/cms-literals/probando.0.app`)
                .set('x-token', token)
                .send({ value: 'updated' })
                .expect(200)
                .end((err, response) => {
                    if (err) {
                        return done(err);
                    }
                    expect(response.body.value).to.be.equals('updated');
                    done();
                });
        });
        it('check update', (done) => {
            app.get(`/api/v1/rest/cms-literals/probando.0.app`)
                .set('x-token', token)
                .expect(200)
                .end((err, response) => {
                    if (err) {
                        return done(err);
                    }
                    expect(response.body.value).to.be.equals('updated');
                    done();
                });
        });
    });
    describe('DELETE /api/v1/rest/:objectType/:id', () => {
        it('delete not valid resource', (done) => {
            app.delete(`/api/v1/rest/not_valid/1`)
                .set('x-token', token)
                .expect(404)
                .end((err, response) => {
                    if (err) {
                        return done(err);
                    }
                    expect(response.text).to.be.equals(literals.RESOURCE_NOT_FOUND);
                    done();
                });
        });
        it('delete resource', (done) => {
            app.delete(`/api/v1/rest/cms-literals/probando.0.app`)
                .set('x-token', token)
                .expect(200)
                .end((err, response) => {
                    if (err) {
                        return done(err);
                    }
                    expect(response.body.key).to.be.equals('probando.0.app');
                    done();
                });
        });
        it('check delete', (done) => {
            app.get(`/api/v1/rest/user/probando.0.app`)
                .set('x-token', token)
                .expect(404)
                .end((err, response) => {
                    if (err) {
                        return done(err);
                    }
                    expect(response.text).to.be.equal(literals.RESOURCE_NOT_FOUND);
                    done();
                });
        });
    });
});