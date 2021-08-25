import { injectable } from "tsyringe";
import { CaseRepository } from "../../repositories/caseRepository";
import { ProjectRepository } from "../../repositories/projectRepository";
import StepRepository from "../../repositories/stepRepository";
import { TestSuiteRepository } from "../../repositories/suiteRepository";
import { UserRepository } from "../../repositories/userRepository";

@injectable()
export class DemoAccountService {
  constructor(
    private userRepository: UserRepository,
    private projectRepository: ProjectRepository,
    private testSuiteRepository: TestSuiteRepository,
    private testCaseRepository: CaseRepository,
    private stepRepository: StepRepository) {

  }

  public async seedDemoAccountData(demoAccountId: string): Promise<void> {
    const user = await this.userRepository.getUserById(demoAccountId);

    if (!user) {
      throw Error("Error seeding demo data: user not found");
    }

    const project = await this.projectRepository.addProject(user, "My Fav Project");

    // suites
    const suiteA = await this.testSuiteRepository.addTestSuite(project, "Suite A");
    const suiteB = await this.testSuiteRepository.addTestSuite(project, "Suite B");

    // test cases
    const caseA1 = await this.testCaseRepository.addCase(suiteA, "Case 1");
    const caseA2 = await this.testCaseRepository.addCase(suiteA, "Case 2");

    const caseB1 = await this.testCaseRepository.addCase(suiteB, "Case 1");
    const caseB2 = await this.testCaseRepository.addCase(suiteB, "Case 2");
    const caseB3 = await this.testCaseRepository.addCase(suiteB, "Case 3");
    const caseB4 = await this.testCaseRepository.addCase(suiteB, "Case 4");

    // steps
    const stepA1A = await this.stepRepository.addStepForCase("Click button", caseA1.id.toString());
    const stepA1B = await this.stepRepository.addStepForCase("funny step", caseA1.id.toString());
    const stepA1C = await this.stepRepository.addStepForCase("funny step", caseA1.id.toString());
    const stepA1D = await this.stepRepository.addStepForCase("funny step", caseA1.id.toString());

    const stepB1A = await this.stepRepository.addStepForCase("Click button", caseA2.id.toString());
    const stepB1B = await this.stepRepository.addStepForCase("funny step", caseA2.id.toString());
    const stepB1C = await this.stepRepository.addStepForCase("funny step", caseA2.id.toString());
    const stepB1D = await this.stepRepository.addStepForCase("funny step", caseA2.id.toString());
  }
}
