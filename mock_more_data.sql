-- 添加更多用户数据
INSERT INTO users (member_number, name, id_number, phone, email, password, avatar, status, role, register_date, last_login) VALUES
('M20250011', '张伟', '110101199101010002', '13800000002', 'zhangwei@example.com', '$2a$10$xVLXqSkHrJ7MHihBJIxAj.Qe7Zs5EDwuFVYaRnpVCQx3pKVIlPBey', '/avatars/user1.jpg', 'active', 'user', DATE_SUB(NOW(), INTERVAL 30 DAY), NOW()),
('M20250012', '王芳', '110101199202020003', '13800000003', 'wangfang@example.com', '$2a$10$xVLXqSkHrJ7MHihBJIxAj.Qe7Zs5EDwuFVYaRnpVCQx3pKVIlPBey', '/avatars/user2.jpg', 'active', 'user', DATE_SUB(NOW(), INTERVAL 25 DAY), NOW()),
('M20250013', '李娜', '110101199303030004', '13800000004', 'lina@example.com', '$2a$10$xVLXqSkHrJ7MHihBJIxAj.Qe7Zs5EDwuFVYaRnpVCQx3pKVIlPBey', '/avatars/user3.jpg', 'active', 'user', DATE_SUB(NOW(), INTERVAL 20 DAY), NOW()),
('M20250014', '赵强', '110101199404040005', '13800000005', 'zhaoqiang@example.com', '$2a$10$xVLXqSkHrJ7MHihBJIxAj.Qe7Zs5EDwuFVYaRnpVCQx3pKVIlPBey', '/avatars/user4.jpg', 'active', 'user', DATE_SUB(NOW(), INTERVAL 15 DAY), NOW()),
('M20250015', '刘洋', '110101199505050006', '13800000006', 'liuyang@example.com', '$2a$10$xVLXqSkHrJ7MHihBJIxAj.Qe7Zs5EDwuFVYaRnpVCQx3pKVIlPBey', '/avatars/user5.jpg', 'active', 'user', DATE_SUB(NOW(), INTERVAL 10 DAY), NOW()),
('M20250016', '陈明', '110101199606060007', '13800000007', 'chenming@example.com', '$2a$10$xVLXqSkHrJ7MHihBJIxAj.Qe7Zs5EDwuFVYaRnpVCQx3pKVIlPBey', '/avatars/user6.jpg', 'inactive', 'user', DATE_SUB(NOW(), INTERVAL 60 DAY), DATE_SUB(NOW(), INTERVAL 30 DAY)),
('M20250017', '杨丽', '110101199707070008', '13800000008', 'yangli@example.com', '$2a$10$xVLXqSkHrJ7MHihBJIxAj.Qe7Zs5EDwuFVYaRnpVCQx3pKVIlPBey', '/avatars/user7.jpg', 'active', 'user', DATE_SUB(NOW(), INTERVAL 5 DAY), NOW()),
('M20250018', '黄海', '110101199808080009', '13800000009', 'huanghai@example.com', '$2a$10$xVLXqSkHrJ7MHihBJIxAj.Qe7Zs5EDwuFVYaRnpVCQx3pKVIlPBey', '/avatars/user8.jpg', 'active', 'user', DATE_SUB(NOW(), INTERVAL 3 DAY), NOW()),
('M20250019', '周燕', '110101199909090010', '13800000010', 'zhouyan@example.com', '$2a$10$xVLXqSkHrJ7MHihBJIxAj.Qe7Zs5EDwuFVYaRnpVCQx3pKVIlPBey', '/avatars/user9.jpg', 'active', 'user', DATE_SUB(NOW(), INTERVAL 2 DAY), NOW()),
('A20250012', '管理员小李', '110101199010100011', '13800000011', 'admin2@example.com', '$2a$10$xVLXqSkHrJ7MHihBJIxAj.Qe7Zs5EDwuFVYaRnpVCQx3pKVIlPBey', '/avatars/admin2.jpg', 'active', 'admin', DATE_SUB(NOW(), INTERVAL 60 DAY), NOW());

-- 添加更多视频数据
INSERT INTO videos (title, description, category_id, instructor_id, duration, video_url, thumbnail_url, access_type, views, status, upload_date) VALUES
('内科护理核心技能', '详细讲解内科护理的核心技能和常见问题处理方法', 6, 1, 3200, '/videos/internal_nursing.mp4', '/thumbnails/internal_nursing.jpg', 'internal', 1420, 'published', DATE_SUB(NOW(), INTERVAL 15 DAY)),
('外科换药技术进阶', '学习外科换药的高级技巧和无菌操作要点', 7, 3, 2800, '/videos/surgical_dressing.mp4', '/thumbnails/surgical_dressing.jpg', 'internal', 1150, 'published', DATE_SUB(NOW(), INTERVAL 14 DAY)),
('儿科用药安全', '儿科常用药物的使用方法、剂量计算和安全注意事项', 8, 5, 2500, '/videos/pediatric_medication.mp4', '/thumbnails/pediatric_medication.jpg', 'external', 980, 'published', DATE_SUB(NOW(), INTERVAL 13 DAY)),
('产科急救处理', '产科常见急症的识别和紧急处理方法', 9, 1, 3000, '/videos/obstetric_emergency.mp4', '/thumbnails/obstetric_emergency.jpg', 'internal', 850, 'published', DATE_SUB(NOW(), INTERVAL 12 DAY)),
('心电图解读基础', '学习心电图的基本原理和常见异常心电图的识别', 6, 2, 2600, '/videos/ecg_basics.mp4', '/thumbnails/ecg_basics.jpg', 'external', 1680, 'published', DATE_SUB(NOW(), INTERVAL 11 DAY)),
('手术室无菌技术', '手术室无菌技术的规范和操作要点', 7, 3, 2900, '/videos/sterile_technique.mp4', '/thumbnails/sterile_technique.jpg', 'internal', 790, 'published', DATE_SUB(NOW(), INTERVAL 10 DAY)),
('新生儿护理专题', '新生儿护理的特殊技巧和注意事项', 8, 4, 2400, '/videos/neonatal_care.mp4', '/thumbnails/neonatal_care.jpg', 'external', 1200, 'published', DATE_SUB(NOW(), INTERVAL 9 DAY)),
('妇科检查技术', '妇科检查的规范操作和患者舒适度管理', 9, 3, 2200, '/videos/gynecological_exam.mp4', '/thumbnails/gynecological_exam.jpg', 'internal', 670, 'published', DATE_SUB(NOW(), INTERVAL 8 DAY)),
('静脉穿刺技术', '各种静脉穿刺技术的详细讲解和实践技巧', 1, 5, 2700, '/videos/venipuncture.mp4', '/thumbnails/venipuncture.jpg', 'external', 1550, 'published', DATE_SUB(NOW(), INTERVAL 7 DAY)),
('气管插管操作', '气管插管的正确操作步骤和常见问题处理', 2, 1, 3100, '/videos/intubation.mp4', '/thumbnails/intubation.jpg', 'internal', 920, 'published', DATE_SUB(NOW(), INTERVAL 6 DAY)),
('血压测量技巧', '准确测量血压的技巧和常见误差分析', 1, 4, 1800, '/videos/blood_pressure.mp4', '/thumbnails/blood_pressure.jpg', 'external', 1380, 'published', DATE_SUB(NOW(), INTERVAL 5 DAY)),
('糖尿病患者护理', '糖尿病患者的专业护理和健康教育', 6, 2, 3400, '/videos/diabetes_care.mp4', '/thumbnails/diabetes_care.jpg', 'internal', 720, 'published', DATE_SUB(NOW(), INTERVAL 4 DAY));

-- 添加会员订阅数据
INSERT INTO subscriptions (user_id, plan_type, start_date, end_date, status, auto_renew) VALUES
(2, 'monthly', DATE_SUB(NOW(), INTERVAL 15 DAY), DATE_ADD(NOW(), INTERVAL 15 DAY), 'active', TRUE),
(3, 'yearly', DATE_SUB(NOW(), INTERVAL 2 MONTH), DATE_ADD(NOW(), INTERVAL 10 MONTH), 'active', TRUE),
(4, 'quarterly', DATE_SUB(NOW(), INTERVAL 1 MONTH), DATE_ADD(NOW(), INTERVAL 2 MONTH), 'active', FALSE),
(5, 'monthly', DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_ADD(NOW(), INTERVAL 20 DAY), 'active', TRUE),
(6, 'yearly', DATE_SUB(NOW(), INTERVAL 3 MONTH), DATE_SUB(NOW(), INTERVAL 1 MONTH), 'expired', FALSE),
(7, 'monthly', DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_ADD(NOW(), INTERVAL 25 DAY), 'active', TRUE),
(8, 'quarterly', DATE_SUB(NOW(), INTERVAL 2 MONTH), DATE_ADD(NOW(), INTERVAL 1 MONTH), 'active', TRUE),
(9, 'yearly', DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_ADD(NOW(), INTERVAL 364 DAY), 'active', TRUE);

-- 添加支付记录数据
INSERT INTO payments (user_id, subscription_id, amount, payment_method, transaction_id, status, payment_date) VALUES
(2, 1, 39.00, 'alipay', 'ALI202501010001', 'completed', DATE_SUB(NOW(), INTERVAL 15 DAY)),
(3, 2, 299.00, 'wechat', 'WX202501010002', 'completed', DATE_SUB(NOW(), INTERVAL 2 MONTH)),
(4, 3, 99.00, 'bank_card', 'BANK202501010003', 'completed', DATE_SUB(NOW(), INTERVAL 1 MONTH)),
(5, 4, 39.00, 'alipay', 'ALI202501010004', 'completed', DATE_SUB(NOW(), INTERVAL 10 DAY)),
(6, 5, 299.00, 'wechat', 'WX202501010005', 'completed', DATE_SUB(NOW(), INTERVAL 3 MONTH)),
(7, 6, 39.00, 'alipay', 'ALI202501010006', 'completed', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(8, 7, 99.00, 'bank_card', 'BANK202501010007', 'completed', DATE_SUB(NOW(), INTERVAL 2 MONTH)),
(9, 8, 299.00, 'wechat', 'WX202501010008', 'completed', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(2, NULL, 39.00, 'alipay', 'ALI202502010001', 'failed', DATE_SUB(NOW(), INTERVAL 16 DAY)),
(5, NULL, 99.00, 'bank_card', 'BANK202502010002', 'refunded', DATE_SUB(NOW(), INTERVAL 20 DAY));

-- 添加视频观看记录数据
INSERT INTO watch_history (user_id, video_id, progress, completed, last_watched) VALUES
(2, 1, 2500, TRUE, DATE_SUB(NOW(), INTERVAL 10 DAY)),
(2, 2, 3200, TRUE, DATE_SUB(NOW(), INTERVAL 9 DAY)),
(2, 9, 1200, FALSE, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(3, 3, 2800, TRUE, DATE_SUB(NOW(), INTERVAL 15 DAY)),
(3, 10, 1500, FALSE, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(3, 12, 3000, TRUE, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(4, 4, 2700, TRUE, DATE_SUB(NOW(), INTERVAL 12 DAY)),
(4, 5, 2000, TRUE, DATE_SUB(NOW(), INTERVAL 8 DAY)),
(4, 11, 900, FALSE, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(5, 1, 2000, TRUE, DATE_SUB(NOW(), INTERVAL 14 DAY)),
(5, 6, 2500, TRUE, DATE_SUB(NOW(), INTERVAL 7 DAY)),
(5, 9, 2600, TRUE, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(6, 2, 1500, FALSE, DATE_SUB(NOW(), INTERVAL 40 DAY)),
(7, 3, 2300, TRUE, DATE_SUB(NOW(), INTERVAL 4 DAY)),
(7, 7, 2200, TRUE, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(8, 8, 1800, TRUE, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(8, 10, 2800, TRUE, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(9, 11, 1700, TRUE, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(9, 12, 3000, TRUE, DATE_SUB(NOW(), INTERVAL 12 HOUR));

-- 添加用户笔记数据
INSERT INTO notes (user_id, video_id, content) VALUES
(2, 1, '护理操作流程：评估、计划、实施、评价'),
(2, 2, '心肺复苏步骤：C-A-B（胸外按压-气道-呼吸）'),
(3, 3, '医疗设备使用前需要进行完整的安全检查'),
(3, 10, '气管插管时需要注意的解剖结构标志'),
(4, 4, '与患者沟通的六步法：问候、介绍、询问、解释、示范、确认'),
(4, 5, '急救药物使用的顺序和适应症'),
(5, 1, '无菌操作技术的核心要点'),
(5, 6, '手术室环境控制的标准要求'),
(6, 2, '成人和儿童心肺复苏的主要区别'),
(7, 3, '常用医疗设备的校准方法和周期'),
(7, 7, '新生儿护理中的温度管理特别重要'),
(8, 8, '妇科检查前的患者准备工作'),
(8, 10, '困难气道处理的备选方案'),
(9, 11, '血压测量时常见的误差来源'),
(9, 12, '糖尿病患者的低血糖处理流程');

-- 添加评论数据
INSERT INTO comments (user_id, video_id, parent_id, content, status) VALUES
(2, 1, NULL, '这个课程讲解非常清晰，对基础护理的理解有很大帮助', 'approved'),
(3, 1, 1, '同意楼上，尤其是操作示范部分非常详细', 'approved'),
(4, 2, NULL, '心肺复苏技术讲解很专业，但希望能有更多的实操演示', 'approved'),
(5, 2, 3, '可以结合模拟人进行实操演示会更好', 'approved'),
(3, 3, NULL, '医疗设备操作指南非常实用，对日常工作有很大帮助', 'approved'),
(2, 4, NULL, '沟通技巧的案例分析很到位，学到了很多实用技巧', 'approved'),
(4, 5, NULL, '药物使用指南内容全面，但部分内容过于专业，理解有难度', 'approved'),
(6, 5, 7, '建议增加一些常见问题的解答环节', 'approved'),
(7, 6, NULL, '创伤急救技术讲解得很清晰，案例丰富', 'approved'),
(8, 7, NULL, '团队协作的重要性讲解得很到位，对提升工作效率很有帮助', 'approved'),
(9, 8, NULL, '医疗记录规范的内容很实用，但希望能有更多实例', 'approved'),
(2, 9, NULL, '静脉穿刺技术讲解很详细，特别是困难穿刺的处理方法', 'approved'),
(3, 10, NULL, '气管插管操作视频很清晰，步骤讲解很到位', 'approved'),
(4, 11, NULL, '血压测量技巧视频对基础操作规范有很大帮助', 'approved'),
(5, 12, NULL, '糖尿病患者护理内容很专业，但希望能增加更多并发症处理的内容', 'approved'),
(6, 9, 12, '同意，特别是老年患者的静脉穿刺技巧很有用', 'pending'),
(7, 10, 13, '另外建议增加困难气道处理的更多技巧', 'approved'),
(8, 11, NULL, '很实用的内容，尤其是特殊人群的血压测量注意事项', 'approved'),
(9, 12, 15, '糖尿病足的护理内容也可以适当增加', 'approved');

-- 添加视频评分数据
INSERT INTO ratings (user_id, video_id, score) VALUES
(2, 1, 5),
(2, 2, 4),
(2, 9, 5),
(3, 1, 4),
(3, 3, 5),
(3, 10, 4),
(4, 2, 3),
(4, 4, 5),
(4, 5, 4),
(5, 1, 5),
(5, 6, 4),
(5, 9, 5),
(6, 2, 3),
(7, 3, 5),
(7, 7, 4),
(8, 8, 4),
(8, 10, 5),
(9, 11, 4),
(9, 12, 5);

-- 添加学习资料数据（补充）
INSERT INTO materials (video_id, name, description, file_url, file_type, file_size, access_type, download_count) VALUES
(9, '静脉穿刺技术手册.pdf', '详细的静脉穿刺步骤和技巧指南', '/files/venipuncture_manual.pdf', 'pdf', 3072, 'external', 420),
(9, '静脉解剖图谱.pdf', '上肢静脉解剖结构详解', '/files/vein_anatomy.pdf', 'pdf', 5120, 'internal', 280),
(10, '气管插管操作指南.pdf', '气管插管的标准操作流程', '/files/intubation_guide.pdf', 'pdf', 2560, 'internal', 350),
(10, '困难气道处理.pdf', '困难气道识别和处理方案', '/files/difficult_airway.pdf', 'pdf', 3584, 'internal', 270),
(11, '血压测量指南.pdf', '准确测量血压的完整指南', '/files/bp_measurement.pdf', 'pdf', 1536, 'external', 510),
(12, '糖尿病护理手册.pdf', '糖尿病患者的全面护理方案', '/files/diabetes_care_manual.pdf', 'pdf', 4096, 'internal', 190),
(12, '胰岛素使用指南.pdf', '各类胰岛素的使用方法和注意事项', '/files/insulin_guide.pdf', 'pdf', 2048, 'internal', 240);

-- 添加证书数据
INSERT INTO certificates (user_id, title, description, issue_date, expiry_date, certificate_url) VALUES
(2, '基础护理技能证书', '完成基础护理技能培训课程并通过考核', DATE_SUB(NOW(), INTERVAL 9 DAY), DATE_ADD(NOW(), INTERVAL 2 YEAR), '/certificates/cert_0001.pdf'),
(3, '高级心肺复苏技术证书', '完成高级心肺复苏技术培训课程并通过考核', DATE_SUB(NOW(), INTERVAL 14 DAY), DATE_ADD(NOW(), INTERVAL 2 YEAR), '/certificates/cert_0002.pdf'),
(4, '医疗设备操作证书', '完成医疗设备操作培训课程并通过考核', DATE_SUB(NOW(), INTERVAL 11 DAY), DATE_ADD(NOW(), INTERVAL 2 YEAR), '/certificates/cert_0003.pdf'),
(5, '患者沟通技巧证书', '完成患者沟通技巧培训课程并通过考核', DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_ADD(NOW(), INTERVAL 2 YEAR), '/certificates/cert_0004.pdf'),
(7, '新生儿护理专题证书', '完成新生儿护理专题培训课程并通过考核', DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_ADD(NOW(), INTERVAL 2 YEAR), '/certificates/cert_0005.pdf'),
(8, '妇科检查技术证书', '完成妇科检查技术培训课程并通过考核', DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_ADD(NOW(), INTERVAL 2 YEAR), '/certificates/cert_0006.pdf'),
(9, '静脉穿刺技术证书', '完成静脉穿刺技术培训课程并通过考核', DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_ADD(NOW(), INTERVAL 2 YEAR), '/certificates/cert_0007.pdf');

-- 添加操作日志数据
INSERT INTO operation_logs (user_id, action, target_type, target_id, details, ip_address, user_agent) VALUES
(2, 'login', 'user', 2, '用户登录成功', '192.168.1.101', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
(2, 'view', 'video', 1, '观看视频', '192.168.1.101', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
(2, 'download', 'material', 1, '下载学习资料', '192.168.1.101', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
(3, 'login', 'user', 3, '用户登录成功', '192.168.1.102', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'),
(3, 'view', 'video', 3, '观看视频', '192.168.1.102', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'),
(3, 'comment', 'video', 3, '发表评论', '192.168.1.102', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'),
(4, 'login', 'user', 4, '用户登录成功', '192.168.1.103', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'),
(4, 'subscribe', 'plan', 3, '订阅季度会员', '192.168.1.103', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'),
(4, 'view', 'video', 5, '观看视频', '192.168.1.103', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'),
(5, 'login', 'user', 5, '用户登录成功', '192.168.1.104', 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15'),
(5, 'rate', 'video', 6, '评分视频', '192.168.1.104', 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15'),
(5, 'note', 'video', 6, '添加笔记', '192.168.1.104', 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15'),
(1, 'login', 'user', 1, '管理员登录成功', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
(1, 'update', 'video', 7, '更新视频信息', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
(1, 'update', 'setting', 1, '更新系统设置', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
(6, 'login', 'user', 6, '用户登录失败，密码错误', '192.168.1.105', 'Mozilla/5.0 (Android 10; Mobile) AppleWebKit/537.36'),
(6, 'login', 'user', 6, '用户登录成功', '192.168.1.105', 'Mozilla/5.0 (Android 10; Mobile) AppleWebKit/537.36'),
(7, 'login', 'user', 7, '用户登录成功', '192.168.1.106', 'Mozilla/5.0 (Linux; Android 11; SM-G970F) AppleWebKit/537.36'),
(8, 'login', 'user', 8, '用户登录成功', '192.168.1.107', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/91.0.864.59'),
(9, 'login', 'user', 9, '用户登录成功', '192.168.1.108', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15'); 