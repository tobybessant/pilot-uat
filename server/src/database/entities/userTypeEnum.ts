import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

export const TABLE_NAME: string = "UserTypeEnum";
@Entity({
    name: TABLE_NAME
})
export class UserTypeEnumDbo {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar" , length: 30 })
    type!: string;

}