import userMock from '../mocks/user-mock';
import async from 'async';
import { UsersService } from 'src/v1/services/users/UsersService';
import { AuthService } from 'src/v1/services/auth/AuthService';
import User from 'src/v1/entities/users/User';

export default class UserBDInitializer {
    constructor(
        private userService: UsersService,
        private authService: AuthService
    ) { }

    public async init() {
        return new Promise((resolve, reject) => {
            async.forEachOf(userMock, async (user, index, cb) => {
                try {
                    const us = new User();
                    Object.assign(us, user);
                    us.password = this.authService.encryptPassword(us.password, us.sal);
                    await this.userService.create(us);
                    cb();
                } catch (e) {
                    cb(e);
                }
            }, err => {
                if (err) {
                    return reject(err);
                }

                return resolve();
            });
        });
    }

    public async destroy() {
        return new Promise((resolve, reject) => {
            async.forEachOf(userMock, async (user, index, cb) => {
                try {
                    await this.userService.deleteById(user.id);
                    cb();
                } catch (e) {
                    cb(e);
                }
            }, err => {
                if (err) {
                    return reject(err);
                }

                return resolve();
            });
        });
    }
}