import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitNotifications1733429100000 implements MigrationInterface {
  name = 'InitNotifications1733429100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "notifications" (
        "id" SERIAL PRIMARY KEY,
        "type" VARCHAR NOT NULL,
        "taskId" INTEGER NOT NULL,
        "userId" INTEGER,
        "message" VARCHAR NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE "notifications";
    `);
  }
}
