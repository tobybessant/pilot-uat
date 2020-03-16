import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { TestSuiteDbo } from "./testSuiteDbo";

@Entity({
  name: "Test"
})
export class TestDbo {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  testCase!: string;

  @ManyToOne(type => TestSuiteDbo, suite => suite.tests, { onDelete: "CASCADE" })
  suite!: TestSuiteDbo;
}