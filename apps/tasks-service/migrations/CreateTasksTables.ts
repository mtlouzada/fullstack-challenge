import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTasksTables1732399999999 implements MigrationInterface {
    name = 'CreateTasksTables1732399999999'

    public async up(queryRunner: QueryRunner): Promise<void> {

        // ENUMS
        await queryRunner.query(`
            CREATE TYPE "priority_enum" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
        `);

        await queryRunner.query(`
            CREATE TYPE "status_enum" AS ENUM ('TODO', 'IN_PROGRESS', 'REVIEW', 'DONE');
        `);

        // TASKS ------------------------------------------------------
        await queryRunner.query(`
            CREATE TABLE "tasks" (
                "id" SERIAL PRIMARY KEY,
                "title" VARCHAR NOT NULL,
                "description" TEXT,
                "dueDate" TIMESTAMPTZ,
                "priority" "priority_enum" NOT NULL DEFAULT 'MEDIUM',
                "status" "status_enum" NOT NULL DEFAULT 'TODO',
                "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
            );
        `);

        // TASK USERS -------------------------------------------------
        await queryRunner.query(`
            CREATE TABLE "task_users" (
                "id" SERIAL PRIMARY KEY,
                "taskId" INTEGER NOT NULL,
                "userId" INTEGER NOT NULL,
                CONSTRAINT "fk_task_users_task" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE,
                CONSTRAINT "uq_task_users" UNIQUE ("taskId", "userId")
            );
        `);

        // COMMENTS ---------------------------------------------------
        await queryRunner.query(`
            CREATE TABLE "task_comments" (
                "id" SERIAL PRIMARY KEY,
                "taskId" INTEGER NOT NULL,
                "authorId" INTEGER NOT NULL,
                "content" TEXT NOT NULL,
                "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
                CONSTRAINT "fk_task_comments_task" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE
            );
        `);

        // AUDIT LOG --------------------------------------------------
        await queryRunner.query(`
            CREATE TABLE "task_audit_logs" (
                "id" SERIAL PRIMARY KEY,
                "taskId" INTEGER NOT NULL,
                "userId" INTEGER NOT NULL,
                "action" TEXT NOT NULL,
                "diff" TEXT,
                "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
                CONSTRAINT "fk_task_audit_logs_task" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`DROP TABLE "task_audit_logs"`);
        await queryRunner.query(`DROP TABLE "task_comments"`);
        await queryRunner.query(`DROP TABLE "task_users"`);

        await queryRunner.query(`DROP TABLE "tasks"`);

        await queryRunner.query(`DROP TYPE "status_enum"`);
        await queryRunner.query(`DROP TYPE "priority_enum"`);
    }
}
