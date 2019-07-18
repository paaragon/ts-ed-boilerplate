const config = require('config');

export const getTypeOrmConfig = (rootDir: string, version: string): any[] => {
    switch (config.get('datasource').type) {
        case 'sqlite':
            return [
                {
                    name: 'default',
                    type: config.get('datasource').type,
                    database: `:memory:`,
                    synchronize: true,
                    logging: false, // ['query'],
                    entities: [
                        `${rootDir}/${version}/entities/**/**.ts`
                    ],
                },
            ];
        default: // oracle
            return [
                {
                    name: 'default',
                    type: config.get('datasource').type,
                    connectString: config.get('datasource').url,
                    username: config.get('datasource').username,
                    password: config.get('datasource').password,
                    synchronize: false,
                    logging: false, // ['query'],
                    entities: [
                        `${rootDir}/${version}/entities/**/**.ts`
                    ],
                },
            ];
    }
};