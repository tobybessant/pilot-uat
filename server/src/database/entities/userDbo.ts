import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable } from "typeorm";
import { UserTypeDbo } from "./userTypeDbo";
import { OrganisationDbo } from "./organisationDbo";


export const TABLE_NAME: string = "User";
@Entity({
    name: TABLE_NAME
})
export class UserDbo {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", length: 255, unique: true })
    email!: string;

    @Column({ select: false })
    passwordHash!: string;

    @Column({ type: "varchar", length: 255 })
    firstName!: string;

    @Column({ type: "varchar", length: 255 })
    lastName!: string;

    @ManyToOne(type => UserTypeDbo)
    @JoinColumn()
    userType!: UserTypeDbo;

    @ManyToMany(type => OrganisationDbo)
    @JoinTable()
    organisations!: OrganisationDbo[];

    @CreateDateColumn()
    createdDate!: Date;
}