import { Entity, Column, PrimaryColumn, Unique } from 'typeorm';
import { Required, MaxLength } from '@tsed/common';

@Entity('USUARIOS_REPORTS')
@Unique(['username'])
export default class User {

    constructor(
        id?: number,
        nombre?: string,
        apellidos?: string,
        username?: string,
        password?: string,
        sal?: string,
        rol?: string
    ) {
        this.id = id;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.username = username;
        this.password = password;
        this.sal = sal;
        this.rol = rol;
    }

    @PrimaryColumn({ name: 'ID' })
    @Required()
    id: number;

    @Column({ name: 'NOMBRE' })
    @MaxLength(64)
    nombre: string;

    @Column({ name: 'APELLIDOS' })
    @MaxLength(64)
    apellidos: string;

    @Column({ name: 'USUARIO' })
    @MaxLength(64)
    @Required()
    username: string;

    @Column({ name: 'PASSWORD' })
    @MaxLength(512)
    password: string;

    @Column({ name: 'SAL' })
    @MaxLength(512)
    sal: string;

    @Column({ name: 'ROL' })
    @MaxLength(64)
    @Required()
    rol: string;
}