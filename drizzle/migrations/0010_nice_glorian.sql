CREATE TABLE "telegram_chats" (
	"id" serial PRIMARY KEY NOT NULL,
	"chat_id" integer NOT NULL,
	"chat_type" varchar(20) NOT NULL,
	"title" varchar(255),
	"message_count" integer DEFAULT 0 NOT NULL,
	"first_message_at" timestamp NOT NULL,
	"last_message_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "telegram_chats_chat_id_unique" UNIQUE("chat_id")
);
--> statement-breakpoint
ALTER TABLE "telegram_messages" ADD COLUMN "chat_id" integer NOT NULL;