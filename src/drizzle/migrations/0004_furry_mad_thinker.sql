ALTER TABLE "fees" DROP CONSTRAINT "fees_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "fees" DROP COLUMN IF EXISTS "userId";