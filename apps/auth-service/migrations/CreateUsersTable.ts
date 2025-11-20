const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class CreateUsersTable1699999999999 {
  name = 'CreateUsersTable1699999999999'

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" SERIAL NOT NULL,
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "currentHashedRefreshToken" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      )
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
