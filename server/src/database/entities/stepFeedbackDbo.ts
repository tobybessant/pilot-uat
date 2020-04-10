import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { StepStatusDbo } from "./stepStatusDbo";
import { UserDbo } from "./userDbo";
import { StepDbo } from "./stepDbo";

@Entity({
  name: "StepFeedback"
})
export class StepFeedbackDbo {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(type => StepDbo, { onDelete: "CASCADE", eager: true })
  step!: StepDbo;

  @ManyToOne(type => UserDbo, { onDelete: "CASCADE", eager: true })
  user!: UserDbo;

  @ManyToOne(type => StepStatusDbo, { eager: true })
  @JoinColumn()
  status!: StepStatusDbo;

  @Column({ type: "nvarchar", length: "800" })
  notes!: string;

  @CreateDateColumn()
  createdDate!: Date;
}
