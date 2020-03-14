import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from "typeorm";
import { ProjectDbo } from "./projectDbo";

export const TABLE_NAME: string = "TestSuite";
@Entity({
    name: TABLE_NAME
})
export class TestSuiteDbo {
    @PrimaryGeneratedColumn()
    id!: string;

    @Column()
    suiteName!: string;

    @ManyToOne(type => ProjectDbo, project => project.testSuites, { primary: true, onDelete: "CASCADE" })
    project!: ProjectDbo;

    @CreateDateColumn()
    createdDate!: Date;
}
