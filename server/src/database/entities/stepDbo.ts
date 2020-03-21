import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { CaseDbo } from "./caseDbo";

export const TABLE_NAME: string = "Step";
@Entity({
    name: TABLE_NAME
})
export class StepDbo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "nvarchar" })
  description!: string;

  @ManyToOne(type => CaseDbo, test => test.steps, { onDelete: "CASCADE" })
  case!: CaseDbo[];
}