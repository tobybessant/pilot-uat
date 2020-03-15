import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { TestSuiteDbo } from "./testSuiteDbo";

@Entity({
  name: "Test"
})
export class TestDbo {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  subject!: string;

  @ManyToOne(type => TestSuiteDbo, suite => suite.tests)
  suite!: TestSuiteDbo;
}