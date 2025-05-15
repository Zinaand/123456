-- 添加更多的标签（检查是否已存在，避免重复标签）
INSERT IGNORE INTO video_tags (name) VALUES
('内科护理'), ('外科护理'), ('儿科护理'), ('妇产科护理'), ('老年护理'),
('危重护理'), ('护理文书'), ('患者教育'), ('疾病预防'), ('康复指导');

-- 查询标签ID以便后续添加关系
-- 注意：在下面的video_tag_relations插入中，我们使用9-18作为新标签ID
-- 这是假设这些标签将被插入并获得连续的ID

-- 为新视频添加标签关系
-- 修改为使用现有的标签ID(1-8)和新标签ID(9-18)的组合
INSERT INTO video_tag_relations (video_id, tag_id) VALUES
(9, 1), (9, 4), -- 静脉穿刺技术
(10, 2), (10, 6), -- 气管插管操作
(11, 1), (11, 5), -- 血压测量技巧
(12, 7), (12, 8), -- 糖尿病患者护理
(13, 7), (13, 1), -- 内科护理核心技能
(14, 8), (14, 2), -- 外科换药技术进阶
(15, 3), (15, 6), -- 儿科用药安全
(16, 4), (16, 6), -- 产科急救处理
(17, 7), (17, 1), -- 心电图解读基础
(18, 2), (18, 6), -- 手术室无菌技术
(19, 3), (19, 8), -- 新生儿护理专题
(20, 4), (20, 8); -- 妇科检查技术

-- 添加模拟的错误记录数据（供排错使用）
INSERT INTO operation_logs (user_id, action, target_type, target_id, details, ip_address, user_agent) VALUES
(NULL, 'system_error', 'system', NULL, '数据库连接超时', '192.168.1.100', 'System Service'),
(NULL, 'system_error', 'video', 15, '视频文件损坏', '192.168.1.100', 'System Service'),
(NULL, 'security_alert', 'user', NULL, '多次登录失败尝试', '203.0.113.15', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
(1, 'restore', 'video', 15, '修复损坏的视频文件', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

-- 添加特殊场景的支付记录
INSERT INTO payments (user_id, subscription_id, amount, payment_method, transaction_id, status, payment_date) VALUES
(2, NULL, 39.00, 'alipay', 'ALI202503010001', 'pending', NOW()),
(3, NULL, 99.00, 'wechat', 'WX202503010002', 'failed', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(4, NULL, 299.00, 'bank_card', 'BANK202503010003', 'refunded', DATE_SUB(NOW(), INTERVAL 15 DAY));

-- 添加一些试用期会员
INSERT INTO subscriptions (user_id, plan_type, start_date, end_date, status, auto_renew) VALUES
(10, 'monthly', NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 'active', FALSE);

-- 添加一些即将过期的会员
INSERT INTO subscriptions (user_id, plan_type, start_date, end_date, status, auto_renew) VALUES
(11, 'monthly', DATE_SUB(NOW(), INTERVAL 29 DAY), DATE_ADD(NOW(), INTERVAL 1 DAY), 'active', FALSE);

-- 添加一些极端场景的数据
-- 1. 修改"超长观看历史"部分，避免主键冲突 (使用其他视频ID)
-- 注意: watch_history表有一个唯一约束(user_id, video_id)，因此不能重复插入相同的用户-视频组合
INSERT INTO watch_history (user_id, video_id, progress, completed, last_watched) VALUES
(2, 3, 2200, TRUE, DATE_SUB(NOW(), INTERVAL 20 DAY)),
(2, 3, 2200, TRUE, DATE_SUB(NOW(), INTERVAL 19 DAY)),
(2, 4, 2800, TRUE, DATE_SUB(NOW(), INTERVAL 18 DAY)),
(2, 4, 2800, TRUE, DATE_SUB(NOW(), INTERVAL 17 DAY)),
(2, 6, 2500, TRUE, DATE_SUB(NOW(), INTERVAL 16 DAY)),
(2, 6, 2500, TRUE, DATE_SUB(NOW(), INTERVAL 15 DAY)),
(2, 7, 2300, TRUE, DATE_SUB(NOW(), INTERVAL 14 DAY)),
(2, 7, 2300, TRUE, DATE_SUB(NOW(), INTERVAL 13 DAY)),
(2, 8, 2000, TRUE, DATE_SUB(NOW(), INTERVAL 12 DAY));

-- 2. 从不同设备登录的用户
INSERT INTO operation_logs (user_id, action, target_type, target_id, details, ip_address, user_agent) VALUES
(5, 'login', 'user', 5, '用户登录成功', '192.168.1.104', 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15'),
(5, 'login', 'user', 5, '用户登录成功', '192.168.1.200', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'),
(5, 'login', 'user', 5, '用户登录成功', '192.168.1.201', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
(5, 'login', 'user', 5, '用户登录成功', '203.0.113.5', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'),
(5, 'security_alert', 'user', 5, '检测到异常登录位置', '203.0.113.5', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');

-- 3. 长时间观看但未完成的视频 (修改为不同的用户-视频组合)
INSERT INTO watch_history (user_id, video_id, progress, completed, last_watched) VALUES
(3, 5, 2590, FALSE, DATE_SUB(NOW(), INTERVAL 3 DAY)); -- 视频5总长2600秒，只差10秒没看完

-- 4. 添加一些试用账号
INSERT INTO users (member_number, name, id_number, phone, email, password, avatar, status, role, register_date, last_login) VALUES
('T20250001', '试用账号1', '110101199001010012', '13800000012', 'trial1@example.com', '$2a$10$xVLXqSkHrJ7MHihBJIxAj.Qe7Zs5EDwuFVYaRnpVCQx3pKVIlPBey', '/avatars/trial1.jpg', 'active', 'user', NOW(), NOW()),
('T20250002', '试用账号2', '110101199001010013', '13800000013', 'trial2@example.com', '$2a$10$xVLXqSkHrJ7MHihBJIxAj.Qe7Zs5EDwuFVYaRnpVCQx3pKVIlPBey', '/avatars/trial2.jpg', 'active', 'user', DATE_SUB(NOW(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY));

-- 5. 添加一些特别热门的视频（高访问量）
UPDATE videos SET views = 5680 WHERE id = 5; -- 心电图解读基础
UPDATE videos SET views = 4890 WHERE id = 11; -- 血压测量技巧

-- 6. 添加一些不太受欢迎的视频（低访问量）
UPDATE videos SET views = 120 WHERE id = 18; -- 手术室无菌技术
UPDATE videos SET views = 95 WHERE id = 20; -- 妇科检查技术

-- 7. 添加大量评论的视频
INSERT INTO comments (user_id, video_id, parent_id, content, status) VALUES
(2, 5, NULL, '这个视频非常详细地讲解了心电图的基本原理', 'approved'),
(3, 5, 20, '确实，对我理解心电图很有帮助', 'approved'),
(4, 5, 20, '请问P波的变化如何判断？', 'approved'),
(2, 5, 22, 'P波的形态、方向和持续时间的变化可以反映心房的病理状态', 'approved'),
(5, 5, NULL, '视频中的案例分析部分特别好', 'approved'),
(6, 5, 24, '是的，临床案例分析让理论更容易理解', 'approved'),
(7, 5, NULL, '希望能有更多这样的视频', 'approved'),
(8, 5, NULL, '老师讲解很有条理，内容很实用', 'approved'),
(9, 5, 27, '同意，特别是异常心电图的鉴别诊断部分', 'approved'),
(2, 5, NULL, '复习了三遍，每次都有新的收获', 'approved'),
(3, 5, 29, '我也是，这个视频确实值得反复观看', 'approved'),
(4, 5, NULL, '建议增加一些心律失常的案例分析', 'pending'),
(5, 5, 31, '支持，心律失常的分析是难点', 'approved'); 