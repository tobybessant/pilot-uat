import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

export const TABLE_NAME: string = "UserType";
@Entity({
    name: TABLE_NAME
})
export class UserTypeDbo {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar" , length: 30 })
    type!: string;
}