import { UseBefore } from '@tsed/common';
import { Store } from '@tsed/core';
import AuthCheckMiddleware from './AuthCheckMiddleware';

export function AuthCheck(...roles: string[]) {
    return Store.decorate((store) => {
        store.set(AuthCheckMiddleware, roles);

        return UseBefore(AuthCheckMiddleware);
    });
}