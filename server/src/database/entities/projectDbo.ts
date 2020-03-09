import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { OrganisationDbo } from "./organisationDbo";
import { UserProjectRoleDbo } from "./userProjectRole";

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

    @OneToMany(type => UserProjectRoleDbo, role => role.project)
    users!: UserProjectRoleDbo[];

    @CreateDateColumn()
    createdDate!: Date;
}
