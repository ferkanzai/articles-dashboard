PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_articles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`author_id` integer NOT NULL,
	`content` text NOT NULL,
	`likes` integer DEFAULT 0 NOT NULL,
	`title` text NOT NULL,
	`views` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_articles`("id", "author_id", "content", "likes", "title", "views", "created_at") SELECT "id", "author_id", "content", "likes", "title", "views", "created_at" FROM `articles`;--> statement-breakpoint
DROP TABLE `articles`;--> statement-breakpoint
ALTER TABLE `__new_articles` RENAME TO `articles`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `author_id_title_idx` ON `articles` (`author_id`,`title`);--> statement-breakpoint
CREATE INDEX `author_id_idx` ON `articles` (`author_id`);--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `articles` (`created_at`);