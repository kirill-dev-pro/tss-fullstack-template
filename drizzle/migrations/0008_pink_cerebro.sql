CREATE TABLE "telegram_contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"telegram_user_id" integer NOT NULL,
	"username" varchar(255),
	"first_name" varchar(255),
	"last_name" varchar(255),
	"messages_sent" integer DEFAULT 0 NOT NULL,
	"messages_received" integer DEFAULT 0 NOT NULL,
	"first_message_at" timestamp NOT NULL,
	"last_message_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "telegram_contacts_telegram_user_id_unique" UNIQUE("telegram_user_id")
);
--> statement-breakpoint
CREATE TABLE "telegram_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"telegram_user_id" integer NOT NULL,
	"username" varchar(255),
	"message_id" integer NOT NULL,
	"direction" varchar(10) NOT NULL,
	"text" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
