import { Operator } from './Operator';

export default interface Filter { name: string; operator: Operator; value: any; }