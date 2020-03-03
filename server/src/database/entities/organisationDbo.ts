import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany, JoinTable } from "typeorm";
import { UserDbo } from "./userDbo";

export const TABLE_NAME: string = "Organisation";
@Entity({
    name: TABLE_NAME
})
export class OrganisationDbo {
    @PrimaryGeneratedColumn()
    id!: string;

    @Column({ type: "varchar", length: 255 })
    organisationName!: string;

    @CreateDateColumn()
    createdDate!: Date;
}