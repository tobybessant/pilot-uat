import { Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, Column } from "typeorm";
import { ProjectDbo } from "./projectDbo";

export const TABLE_NAME: string = "ProjectInvite";
@Entity({
    name: TABLE_NAME
})
export class ProjectInviteDbo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ default: "Pending" })
  status!: "Pending" | "Accepted"

  @Column()
  userEmail!: string;

  @Column()
  userType!: string;

  @Column()
  projectId!: number;
}