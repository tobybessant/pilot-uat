import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({})
export class UserDbo {
    @PrimaryGeneratedColumn("uuid")
    id!: number;

    @Column({ type: "varchar", length: 254, unique: true })
    email!: string;

    @Column()
    passwordHash!: string;

    @Column({ type: "varchar", length: 255 })
    firstName!: string;

    @CreateDateColumn()
    createdDate!: Date;

    @UpdateDateColumn()
    updatedDate!: Date;
}