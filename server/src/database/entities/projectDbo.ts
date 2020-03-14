import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { OrganisationDbo } from "./organisationDbo";
import { UserProjectRoleDbo } from "./userProjectRole";
import { TestSuiteDbo } from "./testSuiteDbo";

export const TABLE_NAME: string = "Project";
@Entity({
    name: TABLE_NAME
})
export class ProjectDbo {
    @PrimaryGeneratedColumn()
    id!: string;

    @Column()
    projectName!: string;

    @ManyToOne(type => OrganisationDbo)
    organisation!: OrganisationDbo;

    @OneToMany(type => UserProjectRoleDbo, role => role.project, { onDelete: "CASCADE" })
    users!: UserProjectRoleDbo[];

    @OneToMany(type => TestSuiteDbo, suite => suite.project, { onDelete: "CASCADE" })
    testSuites!: TestSuiteDbo[];

    @CreateDateColumn()
    createdDate!: Date;
}
