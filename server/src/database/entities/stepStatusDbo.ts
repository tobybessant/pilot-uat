import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

export enum StepStatus {
  NOT_STARTED = "Not Started",
  PASSED = "Passed",
  FAILED = "Failed"
}

export const TABLE_NAME: string = "StepStatus";
@Entity({
  name: TABLE_NAME
})
export class StepStatusDbo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  label!: StepStatus;
}
