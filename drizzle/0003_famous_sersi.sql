ALTER TABLE `games` ADD `apiFootballId` int;--> statement-breakpoint
ALTER TABLE `games` ADD `gameTime` varchar(50);--> statement-breakpoint
ALTER TABLE `games` ADD `stadium` varchar(255);--> statement-breakpoint
ALTER TABLE `games` ADD `round` varchar(100);--> statement-breakpoint
ALTER TABLE `games` ADD `isHome` tinyint;--> statement-breakpoint
ALTER TABLE `games` ADD `attendance` int;--> statement-breakpoint
ALTER TABLE `games` ADD `referee` varchar(255);--> statement-breakpoint
ALTER TABLE `games` ADD `substitutions` text;--> statement-breakpoint
ALTER TABLE `games` ADD `yellowCards` text;--> statement-breakpoint
ALTER TABLE `games` ADD `redCards` text;--> statement-breakpoint
ALTER TABLE `games` ADD `playerStats` text;--> statement-breakpoint
ALTER TABLE `games` ADD `gameStats` text;--> statement-breakpoint
ALTER TABLE `players` ADD `apiFootballId` int;--> statement-breakpoint
ALTER TABLE `players` ADD `yellowCards` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `players` ADD `redCards` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `players` ADD `minutesPlayed` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `players` ADD `cardHistory` text;--> statement-breakpoint
ALTER TABLE `players` ADD `goalHistory` text;