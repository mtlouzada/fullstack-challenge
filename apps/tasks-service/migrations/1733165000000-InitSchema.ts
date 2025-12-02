import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1733165000000 implements MigrationInterface {
    name = 'InitSchema1733165000000'

    public async up(queryRunner: QueryRunner): Promise<void> {

        // ---------- ENUMS ----------
        await queryRunner.query(`
            CREATE TYPE "priority_enum" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT')
        `);

        await queryRunner.query(`
            CREATE TYPE "status_enum" AS ENUM ('TODO', 'IN_PROGRESS', 'REVIEW', 'DONE')
        `);

        // ---------- TASKS ----------
        await queryRunner.query(`
            CREATE TABLE "tasks" (
                "id" SERIAL NOT NULL,
                "title" VARCHAR NOT NULL,
                "description" TEXT,
                "dueDate" TIMESTAMP,
                "priority" "priority_enum" NOT NULL DEFAULT 'MEDIUM',
                "status" "status_enum" NOT NULL DEFAULT 'TODO',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_tasks_id" PRIMARY KEY ("id")
            )
        `);

        // ---------- COMMENTS ----------
        await queryRunner.query(`
            CREATE TABLE "comments" (
                "id" SERIAL NOT NULL,
                "taskId" INTEGER NOT NULL,
                "content" TEXT NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_comments_id" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "comments"
            ADD CONSTRAINT "FK_comments_taskId"
            FOREIGN KEY ("taskId")
            REFERENCES "tasks"("id")
            ON DELETE CASCADE
            ON UPDATE CASCADE
        `);

        // ---------- TASK_USER ----------
        await queryRunner.query(`
            CREATE TABLE "task_user" (
                "id" SERIAL NOT NULL,
                "taskId" INTEGER NOT NULL,
                "userId" INTEGER NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_task_user_id" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "task_user"
            ADD CONSTRAINT "FK_task_user_taskId"
            FOREIGN KEY ("taskId")
            REFERENCES "tasks"("id")
            ON DELETE CASCADE
            ON UPDATE CASCADE
        `);

        // ---------- AUDIT_LOG ----------
        await queryRunner.query(`
            CREATE TABLE "audit_log" (
                "id" SERIAL NOT NULL,
                "taskId" INTEGER NOT NULL,
                "action" VARCHAR NOT NULL,
                "userId" INTEGER,
                "diff" TEXT,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_audit_log_id" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "audit_log"
            ADD CONSTRAINT "FK_audit_log_taskId"
            FOREIGN KEY ("taskId")
            REFERENCES "tasks"("id")
            ON DELETE CASCADE
            ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE "audit_log" DROP CONSTRAINT "FK_audit_log_taskId"`);
        await queryRunner.query(`DROP TABLE "audit_log"`);

        await queryRunner.query(`ALTER TABLE "task_user" DROP CONSTRAINT "FK_task_user_taskId"`);
        await queryRunner.query(`DROP TABLE "task_user"`);

        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_comments_taskId"`);
        await queryRunner.query(`DROP TABLE "comments"`);

        await queryRunner.query(`DROP TABLE "tasks"`);

        await queryRunner.query(`DROP TYPE "priority_enum"`);
        await queryRunner.query(`DROP TYPE "status_enum"`);
    }
}
