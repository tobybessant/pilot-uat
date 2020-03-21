import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { SuiteDbo } from "./suiteDbo";
import { StepDbo } from "./stepDbo";

@Entity({
  name: "Case"
})
export class CaseDbo {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({ length: 255 })
  title!: string;

  @OneToMany(type => StepDbo, steps => steps.case, { onDelete: "CASCADE" })
  steps!: StepDbo[];

  @ManyToOne(type => SuiteDbo, suite => suite.cases, { onDelete: "CASCADE" })
  suite!: SuiteDbo;
}