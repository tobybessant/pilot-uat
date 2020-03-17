import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

export const TABLE_NAME: string = "TestStatus";
@Entity({
  name: TABLE_NAME
})
export class TestStatusDbo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  status!: string;
}