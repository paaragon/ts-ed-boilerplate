import { Exception } from 'ts-httpexceptions';

export default class OperatorNotFoundException extends Exception {
    public message: string = '';
    constructor(msg?: string) {
        super(msg);
        this.message = msg;
    }
}