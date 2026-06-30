CREATE TABLE `section_regenerations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`blueprintId` int NOT NULL,
	`userId` int NOT NULL,
	`sectionKey` varchar(64) NOT NULL,
	`sectionTitle` varchar(256) NOT NULL,
	`content` text NOT NULL,
	`version` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `section_regenerations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `blueprints` ADD `industry` varchar(128);--> statement-breakpoint
ALTER TABLE `blueprints` ADD `budget` varchar(64);--> statement-breakpoint
ALTER TABLE `blueprints` ADD `teamSize` varchar(64);--> statement-breakpoint
ALTER TABLE `blueprints` ADD `timeline` varchar(64);--> statement-breakpoint
ALTER TABLE `blueprints` ADD `revenueModel` varchar(128);--> statement-breakpoint
ALTER TABLE `blueprints` ADD `modelUsed` varchar(64);--> statement-breakpoint
ALTER TABLE `blueprints` ADD `generationTimeMs` int;