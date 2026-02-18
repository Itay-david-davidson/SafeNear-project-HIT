CREATE TABLE IF NOT EXISTS `shelters` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(20) UNIQUE,
  `open` boolean DEFAULT false COMMENT 'true for open',
  `location` varchar(20) NOT NULL,
  `map_id` integer NOT NULL
);

CREATE TABLE IF NOT EXISTS `users` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `username` varchar(20) UNIQUE NOT NULL,
  `password` varchar(255) NOT NULL,
  `admin` boolean DEFAULT false COMMENT 'true for admin',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `maps` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(20) UNIQUE,
  `path` varchar(255) UNIQUE NOT NULL
);

ALTER TABLE `shelters` ADD FOREIGN KEY (`map_id`) REFERENCES `maps` (`id`);
