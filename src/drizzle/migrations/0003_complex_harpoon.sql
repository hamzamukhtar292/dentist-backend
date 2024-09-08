ALTER TABLE "fees" DROP CONSTRAINT "fees_id_patient_id_fk";
--> statement-breakpoint
ALTER TABLE "fees" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "fees" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "fees" ALTER COLUMN "id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "fees" ADD COLUMN "patientId" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fees" ADD CONSTRAINT "fees_patientId_patient_id_fk" FOREIGN KEY ("patientId") REFERENCES "public"."patient"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
