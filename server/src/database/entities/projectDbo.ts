import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { OrganisationDbo } from "./organisationDbo";
import { UserProjectRoleDbo } from "./userProjectRoleDbo";
import { SuiteDbo } from "./suiteDbo";

export const TABLE_NAME: string = "Project";
@Entity({
    name: TABLE_NAME
})
export class ProjectDbo {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @ManyToOne(type => OrganisationDbo)
    organisation!: OrganisationDbo;

    @OneToMany(type => UserProjectRoleDbo, role => role.project, { eager: true, onDelete: "CASCADE" })
    users!: UserProjectRoleDbo[];

    @OneToMany(type => SuiteDbo, suite => suite.project, { eager: true, onDelete: "CASCADE" })
    suites!: SuiteDbo[];

    @CreateDateColumn()
    createdDate!: Date;
}
