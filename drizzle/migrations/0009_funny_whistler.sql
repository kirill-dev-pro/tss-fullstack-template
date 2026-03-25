ALTER TABLE "telegram_contacts" ADD COLUMN "blocked_at" timestamp;--> statement-breakpoint
ALTER TABLE "telegram_contacts" ADD COLUMN "opened_mini_app_at" timestamp;--> statement-breakpoint
ALTER TABLE "telegram_messages" ADD COLUMN "message_type" varchar(30) DEFAULT 'text' NOT NULL;--> statement-breakpoint
ALTER TABLE "telegram_messages" ADD COLUMN "media" jsonb;