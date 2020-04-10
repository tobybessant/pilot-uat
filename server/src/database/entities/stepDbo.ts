import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { CaseDbo } from "./caseDbo";
import { StepStatusDbo } from "./stepStatusDbo";
import { StepFeedbackDbo } from "./stepFeedbackDbo";

export const TABLE_NAME: string = "Step";
@Entity({
    name: TABLE_NAME
})
export class StepDbo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "nvarchar" })
  description!: string;

  @ManyToOne(type => StepStatusDbo, { eager: true })
  @JoinColumn()
  status!: StepStatusDbo;

  @ManyToOne(type => CaseDbo, test => test.steps, { onDelete: "CASCADE" })
  case!: CaseDbo;

  @OneToMany(type => StepFeedbackDbo, feedback => feedback.step, { onDelete: "CASCADE" })
  feedback!: StepFeedbackDbo[];
}