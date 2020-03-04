import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from "typeorm";
import { UserDbo } from "./userDbo";
import { ProjectDbo } from "./projectDbo";
import { ProjectController } from "../../controllers";

export const TABLE_NAME: string = "UserProjectRole";
@Entity({
    name: TABLE_NAME
})
export class UserProjectRoleDbo {
    @PrimaryGeneratedColumn()
    id!: string;

    @ManyToOne(type => UserDbo, user => user.projects, { primary: true })
    user!: UserDbo;

    @ManyToOne(type => ProjectDbo, project => project.users, { primary: true })
    project!: ProjectDbo;

    @CreateDateColumn()
    createdDate!: Date;
}