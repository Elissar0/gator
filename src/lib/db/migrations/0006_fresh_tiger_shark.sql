ALTER TABLE "feeds" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "feeds" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "feeds" ADD COLUMN "last_fetched_at" timestamp;