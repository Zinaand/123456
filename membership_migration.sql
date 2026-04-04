-- ============================================================
-- 会员字段迁移脚本（适用于已有数据库）
-- 执行方式：在 MySQL 中运行以下语句
-- ============================================================

-- 添加会员相关字段
ALTER TABLE `users`
ADD COLUMN `membership_type` varchar(20) NULL DEFAULT NULL COMMENT '会员类型 (YEARLY/QUARTERLY/MONTHLY/NONE)' AFTER `updated_at`,
ADD COLUMN `membership_start_date` datetime NULL DEFAULT NULL COMMENT '会员开始时间' AFTER `membership_type`,
ADD COLUMN `membership_expire_date` datetime NULL DEFAULT NULL COMMENT '会员到期时间' AFTER `membership_start_date`;

-- 为管理员账号设置测试会员资格（可选，用于测试）
-- UPDATE `users` SET `membership_type` = 'YEARLY',
--    `membership_start_date` = NOW(),
--    `membership_expire_date` = DATE_ADD(NOW(), INTERVAL 1 YEAR)
-- WHERE `role` IN ('admin', 'super_admin');
