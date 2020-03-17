import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { TestSuiteDbo } from "./testSuiteDbo";
import { TestStatusDbo } from "./testStatusDbo";

@Entity({
  name: "Test"
})
export class TestDbo {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  testCase!: string;

  @ManyToOne(type => TestStatusDbo)
  @JoinColumn()
  status!: TestStatusDbo;

  @ManyToOne(type => TestSuiteDbo, suite => suite.tests, { onDelete: "CASCADE" })
  suite!: TestSuiteDbo;
}