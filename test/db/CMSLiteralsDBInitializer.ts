import cmsLiteralsMock from '../mocks/cms-literals-mock';
import async from 'async';
import RestService from 'src/v1/services/rest/RestService';
import CMSLiterals from 'src/v1/entities/cms-literals/cms-literals';

export default class CMSLiteralsBDInitializer {
    constructor(
        private restService: RestService,
    ) { }

    public async init() {
        return new Promise((resolve, reject) => {
            async.forEachOf(cmsLiteralsMock, async (literal, index, cb) => {
                try {
                    await this.restService.create(CMSLiterals, literal);
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
            async.forEachOf(cmsLiteralsMock, async (literal, index, cb) => {
                try {
                    await this.restService.deleteById(CMSLiterals, literal.key);
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