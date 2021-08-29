import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from "typeorm";
import { UserDbo } from "./userDbo";
import { ProjectDbo } from "./projectDbo";

export const TABLE_NAME: string = "UserProjectRole";
@Entity({
    name: TABLE_NAME
})
export class UserProjectRoleDbo {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(type => UserDbo, user => user.projects, { onDelete: "NO ACTION" })
    user!: UserDbo;

    @ManyToOne(type => ProjectDbo, project => project.users, { onDelete: "CASCADE" })
    project!: ProjectDbo;

    @CreateDateColumn()
    createdDate!: Date;
}