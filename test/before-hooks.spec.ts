import { TestContext, bootstrap } from '@tsed/testing';
import { $log } from 'ts-log-debug';
import { Server } from 'src/Server';
before(TestContext.create);
before(() => {
    $log.level = 'ALL';
});
after(TestContext.reset);
before(bootstrap(Server));