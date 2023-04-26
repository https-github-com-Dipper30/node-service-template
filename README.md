# node-service-template
Node Service Template: Node + Vite + Typescript + Sequelize + Mysql

# Get Started

## Install NPM
```shell
npm install
```

## Build Env File
Create file '.env.development'.
Paste and modify codes below.
``` shell
# config
PORT = 3030
DOMAIN = 'localhost:3030'

# keys
TOKEN_PRIVATE_KEY = youwillneverknow
TOKEN_PUBLIC_KEY = youwillneverknow
TOKEN_EXPIRE_IN = 3000000
MD5_PRIVATE_KEY = youwillneverknow

# db
USERNAME = xxxxxx
PASSWORD = xxxxxx
DATABASE = demo
HOST = 127.0.0.1
DIALECT = mysql
DIALECT_OPTION = {'socketPath': '/tmp/mysql.sock'} #optional
```

## Init Mysql Database

Run codes below

``` sql
/*
 Source Server         : db
 Source Server Type    : MySQL
 Source Server Version : 80029
 Source Host           : localhost:3306
 Source Schema         : demo

 Target Server Type    : MySQL
 Target Server Version : 80029
 File Encoding         : 65001
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for Authorities
-- ----------------------------
DROP TABLE IF EXISTS `Authorities`;
CREATE TABLE `Authorities` (
  `id` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of Authorities
-- ----------------------------
BEGIN;
INSERT INTO `Authorities` VALUES (1, 'admin_login', '登录后台');
INSERT INTO `Authorities` VALUES (5, 'create_account', '创建账号');
INSERT INTO `Authorities` VALUES (10, 'modify_auth', '修改权限、角色配置');
INSERT INTO `Authorities` VALUES (15, 'modify_account', '修改用户信息');
INSERT INTO `Authorities` VALUES (1000, 'login_biz', '登录商户应用');
INSERT INTO `Authorities` VALUES (2000, 'login_client', '登录用户应用');
COMMIT;

-- ----------------------------
-- Table structure for RoleAuthorities
-- ----------------------------
DROP TABLE IF EXISTS `RoleAuthorities`;
CREATE TABLE `RoleAuthorities` (
  `rid` int NOT NULL,
  `aid` int NOT NULL,
  PRIMARY KEY (`rid`,`aid`),
  KEY `aid` (`aid`),
  CONSTRAINT `roleauthorities_ibfk_1` FOREIGN KEY (`rid`) REFERENCES `Roles` (`id`),
  CONSTRAINT `roleauthorities_ibfk_2` FOREIGN KEY (`aid`) REFERENCES `Authorities` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of RoleAuthorities
-- ----------------------------
BEGIN;
INSERT INTO `RoleAuthorities` VALUES (1, 1);
INSERT INTO `RoleAuthorities` VALUES (2, 1);
INSERT INTO `RoleAuthorities` VALUES (1, 5);
INSERT INTO `RoleAuthorities` VALUES (1, 10);
INSERT INTO `RoleAuthorities` VALUES (1, 15);
INSERT INTO `RoleAuthorities` VALUES (1, 1000);
INSERT INTO `RoleAuthorities` VALUES (2, 1000);
INSERT INTO `RoleAuthorities` VALUES (50, 1000);
INSERT INTO `RoleAuthorities` VALUES (1, 2000);
INSERT INTO `RoleAuthorities` VALUES (2, 2000);
INSERT INTO `RoleAuthorities` VALUES (100, 2000);
COMMIT;

-- ----------------------------
-- Table structure for Roles
-- ----------------------------
DROP TABLE IF EXISTS `Roles`;
CREATE TABLE `Roles` (
  `id` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of Roles
-- ----------------------------
BEGIN;
INSERT INTO `Roles` VALUES (1, 'super_admin', '超级管理员');
INSERT INTO `Roles` VALUES (2, 'admin', '管理员');
INSERT INTO `Roles` VALUES (50, 'buz_user', '商户');
INSERT INTO `Roles` VALUES (100, 'user', '用户');
COMMIT;

-- ----------------------------
-- Table structure for UserAuthorities
-- ----------------------------
DROP TABLE IF EXISTS `UserAuthorities`;
CREATE TABLE `UserAuthorities` (
  `uid` int NOT NULL,
  `aid` int NOT NULL,
  PRIMARY KEY (`uid`,`aid`),
  KEY `aid` (`aid`),
  CONSTRAINT `userauthorities_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `Users` (`id`),
  CONSTRAINT `userauthorities_ibfk_2` FOREIGN KEY (`aid`) REFERENCES `Authorities` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of UserAuthorities
-- ----------------------------
BEGIN;
INSERT INTO `UserAuthorities` VALUES (1, 1);
INSERT INTO `UserAuthorities` VALUES (1, 5);
INSERT INTO `UserAuthorities` VALUES (1, 10);
INSERT INTO `UserAuthorities` VALUES (1, 15);
INSERT INTO `UserAuthorities` VALUES (1, 1000);
INSERT INTO `UserAuthorities` VALUES (1, 2000);
COMMIT;

-- ----------------------------
-- Table structure for Users
-- ----------------------------
DROP TABLE IF EXISTS `Users`;
CREATE TABLE `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL COMMENT '比较用户名时忽略大小写',
  `password` varchar(255) NOT NULL,
  `rid` int NOT NULL,
  `cid` int DEFAULT NULL COMMENT '创建人id',
  `destroyed` tinyint(1) DEFAULT NULL,
  `createdAt` bigint DEFAULT NULL,
  `updatedAt` bigint DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL COMMENT 'image id',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `rid` (`rid`),
  KEY `cid` (`cid`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`rid`) REFERENCES `Roles` (`id`),
  CONSTRAINT `users_ibfk_2` FOREIGN KEY (`cid`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of Users
-- ----------------------------
BEGIN;
INSERT INTO `Users` VALUES (1, 'SuperAdmin', 'c8cf9f492a347f3078b23962d14b8c05', 1, NULL, 0, 1654383101000, 1679767386282, 'superadmin@aptx.com', NULL);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;

```

## Run Project
``` shell
npm run dev
```
