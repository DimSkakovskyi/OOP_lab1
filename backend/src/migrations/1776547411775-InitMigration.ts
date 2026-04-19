import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1776547411775 implements MigrationInterface {
    name = 'InitMigration1776547411775'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cards" ("id" SERIAL NOT NULL, "card_number" character varying NOT NULL, "expiry_date" character varying NOT NULL, "account_id" integer NOT NULL, CONSTRAINT "UQ_7eaa552a6443b09c5033ebce5e6" UNIQUE ("card_number"), CONSTRAINT "PK_5f3269634705fdff4a9935860fc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "payments" ("id" SERIAL NOT NULL, "amount" numeric(12,2) NOT NULL, "type" character varying NOT NULL, "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "account_id" integer NOT NULL, CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "accounts" ("id" SERIAL NOT NULL, "account_number" character varying NOT NULL, "balance" numeric(12,2) NOT NULL DEFAULT '0', "is_blocked" boolean NOT NULL DEFAULT false, "user_id" integer NOT NULL, CONSTRAINT "UQ_ffd1ae96513bfb2c6eada0f7d31" UNIQUE ("account_number"), CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "login" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'CLIENT', CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c" UNIQUE ("login"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "cards" ADD CONSTRAINT "FK_b2874ef49ff7da2dee49e4bc6d3" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_d1d6bb7488342d051d20e48ae1f" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD CONSTRAINT "FK_3000dad1da61b29953f07476324" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "FK_3000dad1da61b29953f07476324"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_d1d6bb7488342d051d20e48ae1f"`);
        await queryRunner.query(`ALTER TABLE "cards" DROP CONSTRAINT "FK_b2874ef49ff7da2dee49e4bc6d3"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "accounts"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TABLE "cards"`);
    }

}
