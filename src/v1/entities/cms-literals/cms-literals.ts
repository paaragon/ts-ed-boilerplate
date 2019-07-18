import { Entity, PrimaryColumn, Column } from 'typeorm';
import { Required } from '@tsed/common';

@Entity('FAQS_YAML')
export default class CMSLiterals {

    constructor(
        key?: string,
        value?: string,
        category?: string
    ) {
        this.key = key;
        this.value = value;
        this.category = category;
    }

    @PrimaryColumn({ name: 'KEY' })
    @Required()
    key: string;

    @Column({ name: 'VALUE' })
    @Required()
    value: string;

    @Column({ name: 'CATEGORY', default: 'Faq' })
    @Required()
    category: string;
}