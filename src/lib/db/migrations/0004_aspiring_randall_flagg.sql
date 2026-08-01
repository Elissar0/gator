ALTER TABLE "feeds" ALTER COLUMN "updated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "feeds" ALTER COLUMN "updated_at" DROP NOT NULL;