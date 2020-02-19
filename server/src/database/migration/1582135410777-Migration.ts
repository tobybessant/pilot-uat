import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1582135410777 implements MigrationInterface {
    name = 'Migration1582135410777'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" ADD "createdDate" datetime2 NOT NULL CONSTRAINT "DF_ba08af85fb92a028b0b636c0215" DEFAULT getdate()`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "updatedDate" datetime2 NOT NULL CONSTRAINT "DF_634c2f352b0250709ec24ace06a" DEFAULT getdate()`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "id" uniqueidentifier NOT NULL CONSTRAINT "DF_cace4a159ff9f2512dd42373760" DEFAULT NEWSEQUENTIALID()`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "email" varchar(254) NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "firstName"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "firstName" varchar(255) NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "firstName"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "firstName" nvarchar(255) NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "email" nvarchar(255) NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "id" int NOT NULL IDENTITY(1,1)`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "DF_634c2f352b0250709ec24ace06a"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedDate"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "DF_ba08af85fb92a028b0b636c0215"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdDate"`, undefined);
    }

}
