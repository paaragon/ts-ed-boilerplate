import { TokenPayload } from './TokenPayload';

export interface TokenResponse { error: boolean; errorCode?: number; message?: string; token?: TokenPayload; }