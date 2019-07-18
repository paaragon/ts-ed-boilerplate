import { GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings } from '@tsed/common';
import '@tsed/typeorm';
import '@tsed/swagger';
import { $log } from 'ts-log-debug';

const config = require('config');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const rootDir = __dirname;
const version = config.get('server').api.version;
import { getTypeOrmConfig } from './typeorm-config';

@ServerSettings({
  rootDir,
  acceptMimes: ['application/json'],
  logger: {
    debug: false,
    logRequest: true,
    requestFields: ['reqId', 'method', 'url', 'headers', 'query', 'params', 'duration']
  },
  httpPort: process.env.PORT || 3000,
  swagger: {
    path: '/api-docs',
    outFile: `${rootDir}/../spec/swagger.json`,
    specPath: `${rootDir}/../spec/swagger.base.json`,
    spec: { swagger: '2.0' }
  },
  calendar: {
    token: true
  },
  mount: {
    '/api/v1': `${rootDir}/v1/controllers/**/*.ts`
  },
  componentsScan: [
    `${rootDir}/${version}/services/**/**.ts`,
    `${rootDir}/${version}/middlewares/**/**.ts`
  ],
  typeorm: getTypeOrmConfig(rootDir, version)
})
export class Server extends ServerLoader {
  /**
   * This method let you configure the middleware required by your application to works.
   * @returns {Server}
   */
  async $onMountingMiddlewares(): Promise<any> {
    await this
      .use(GlobalAcceptMimesMiddleware)
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({
        extended: true
      }));

    return null;
  }

  $onReady() {
    $log.debug('Server initialized');
  }

  $onServerInitError(error): any {
    $log.error('Server encounter an error =>', error);
  }
}
