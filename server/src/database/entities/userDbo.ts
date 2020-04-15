import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { UserTypeDbo } from "./userTypeDbo";
import { OrganisationDbo } from "./organisationDbo";
import { ProjectDbo } from "./projectDbo";
import { UserProjectRoleDbo } from "./userProjectRoleDbo";
import { StepFeedbackDbo } from "./stepFeedbackDbo";


export const TABLE_NAME: string = "User";
@Entity({
    name: TABLE_NAME
})
export class UserDbo {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

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

    @ManyToMany(type => OrganisationDbo, org => org.users)
    @JoinTable({ name: "UserOrganisation" })
    organisations!: OrganisationDbo[];

    @OneToMany(type => UserProjectRoleDbo, role => role.user)
    projects!: UserProjectRoleDbo[];

    @OneToMany(type => StepFeedbackDbo, step => step.user)
    stepFeedback!: StepFeedbackDbo[];

    @CreateDateColumn()
    createdDate!: Date;
}