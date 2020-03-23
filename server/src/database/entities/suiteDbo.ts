import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { ProjectDbo } from "./projectDbo";
import { CaseDbo } from "./caseDbo";

export const TABLE_NAME: string = "Suite";
@Entity({
    name: TABLE_NAME
})
export class SuiteDbo {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @ManyToOne(type => ProjectDbo, project => project.suites, { onDelete: "CASCADE" })
    project!: ProjectDbo;

    @CreateDateColumn()
    createdDate!: Date;

    @OneToMany(type => CaseDbo, test => test.suite, { onDelete: "CASCADE" })
    cases!: CaseDbo[];
}
