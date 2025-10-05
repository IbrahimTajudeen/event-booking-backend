import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1759646221660 implements MigrationInterface {
    name = 'InitialMigration1759646221660'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "events" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "date" TIMESTAMP NOT NULL, "location" character varying NOT NULL, "price" numeric(10,2) NOT NULL, "status" "public"."events_status_enum" NOT NULL DEFAULT 'active', "capacity" integer NOT NULL DEFAULT '100', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdById" integer, "organizerId" integer, CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "status" "public"."users_status_enum" NOT NULL DEFAULT 'active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "bookings" ("id" SERIAL NOT NULL, "tickets" integer NOT NULL DEFAULT '1', "status" character varying NOT NULL DEFAULT 'pending', "bookedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "eventId" integer, CONSTRAINT "PK_bee6805982cc1e248e94ce94957" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "payments" ("id" SERIAL NOT NULL, "amount" numeric(10,2) NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "paidAt" TIMESTAMP NOT NULL DEFAULT now(), "bookingId" integer, "userId" integer, CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_2fb864f37ad210f4295a09b684d" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_1024d476207981d1c72232cf3ca" FOREIGN KEY ("organizerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_38a69a58a323647f2e75eb994de" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_f95d476ef16fad91a50544b60c3" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_1ead3dc5d71db0ea822706e389d" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_d35cb3c13a18e1ea1705b2817b1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_d35cb3c13a18e1ea1705b2817b1"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_1ead3dc5d71db0ea822706e389d"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_f95d476ef16fad91a50544b60c3"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_38a69a58a323647f2e75eb994de"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_1024d476207981d1c72232cf3ca"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_2fb864f37ad210f4295a09b684d"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TABLE "bookings"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "events"`);
    }

}
