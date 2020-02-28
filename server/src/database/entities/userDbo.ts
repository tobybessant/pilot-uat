import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, RelationId, JoinColumn } from "typeorm";
import { UserTypeDbo } from "./userTypeDbo";


export const TABLE_NAME: string = "User";
@Entity({
    name: TABLE_NAME
})
export class UserDbo {
    @PrimaryGeneratedColumn("uuid")
    id!: number;

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

    @CreateDateColumn()
    createdDate!: Date;
}