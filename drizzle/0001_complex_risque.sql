CREATE TABLE `blueprints` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(512) NOT NULL,
	`projectIdea` text NOT NULL,
	`projectType` varchar(128) NOT NULL,
	`targetAudience` text NOT NULL,
	`coreFeatures` text NOT NULL,
	`content` text NOT NULL,
	`language` varchar(8) NOT NULL DEFAULT 'en',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blueprints_id` PRIMARY KEY(`id`)
);
