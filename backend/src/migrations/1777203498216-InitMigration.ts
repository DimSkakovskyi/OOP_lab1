import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1777203498216 implements MigrationInterface {
    name = 'InitMigration1777203498216'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" ADD "source_card_id" integer`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "destination_card_id" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "destination_card_id"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "source_card_id"`);
    }

}
