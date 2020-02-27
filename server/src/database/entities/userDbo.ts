import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, RelationId } from "typeorm";
import { UserTypeEnumDbo } from "./userTypeEnum";

export const TABLE_NAME: string = "User";
@Entity({
    name: TABLE_NAME
})
export class UserDbo {
    @PrimaryGeneratedColumn("uuid")
    id!: number;

    @Column({ type: "varchar", length: 255, unique: true })
    email!: string;

    @Column()
    passwordHash!: string;

    @Column({ type: "varchar", length: 255 })
    firstName!: string;

    @Column({ type: "varchar", length: 255 })
    lastName!: string;

    @ManyToOne(type => UserTypeEnumDbo)
    userType!: UserTypeEnumDbo;

    @RelationId((user: UserDbo) => user.userType)
    userTypeId!: number;

    @CreateDateColumn()
    createdDate!: Date;
}