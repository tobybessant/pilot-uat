import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { CaseDbo } from "./caseDbo";
import { StepStatusDbo } from "./stepStatusDbo";

export const TABLE_NAME: string = "Step";
@Entity({
    name: TABLE_NAME
})
export class StepDbo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "nvarchar" })
  description!: string;

  @ManyToOne(type => StepStatusDbo)
  @JoinColumn()
  status!: StepStatusDbo;

  @ManyToOne(type => CaseDbo, test => test.steps, { onDelete: "CASCADE" })
  case!: CaseDbo;
}