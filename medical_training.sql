/*
 Navicat Premium Dump SQL

 Source Server         : 123456
 Source Server Type    : MySQL
 Source Server Version : 80015 (8.0.15)
 Source Host           : localhost:3306
 Source Schema         : medical_training

 Target Server Type    : MySQL
 Target Server Version : 80015 (8.0.15)
 File Encoding         : 65001

 Date: 12/05/2025 09:39:19
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for certificates
-- ----------------------------
DROP TABLE IF EXISTS `certificates`;
CREATE TABLE `certificates`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '用户ID',
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '证书标题',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '证书描述',
  `issue_date` datetime NOT NULL COMMENT '颁发日期',
  `expiry_date` datetime NULL DEFAULT NULL COMMENT '过期日期',
  `certificate_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '证书URL',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_issue_date`(`issue_date` ASC) USING BTREE,
  INDEX `idx_expiry_date`(`expiry_date` ASC) USING BTREE,
  CONSTRAINT `certificates_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '证书表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of certificates
-- ----------------------------
INSERT INTO `certificates` VALUES (1, 2, '基础护理技能证书', '完成基础护理技能培训课程并通过考核', '2025-04-29 16:38:58', '2027-05-08 16:38:58', '/certificates/cert_0001.pdf', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `certificates` VALUES (2, 3, '高级心肺复苏技术证书', '完成高级心肺复苏技术培训课程并通过考核', '2025-04-24 16:38:58', '2027-05-08 16:38:58', '/certificates/cert_0002.pdf', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `certificates` VALUES (3, 4, '医疗设备操作证书', '完成医疗设备操作培训课程并通过考核', '2025-04-27 16:38:58', '2027-05-08 16:38:58', '/certificates/cert_0003.pdf', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `certificates` VALUES (4, 5, '患者沟通技巧证书', '完成患者沟通技巧培训课程并通过考核', '2025-04-30 16:38:58', '2027-05-08 16:38:58', '/certificates/cert_0004.pdf', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `certificates` VALUES (5, 7, '新生儿护理专题证书', '完成新生儿护理专题培训课程并通过考核', '2025-05-07 16:38:58', '2027-05-08 16:38:58', '/certificates/cert_0005.pdf', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `certificates` VALUES (6, 8, '妇科检查技术证书', '完成妇科检查技术培训课程并通过考核', '2025-05-04 16:38:58', '2027-05-08 16:38:58', '/certificates/cert_0006.pdf', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `certificates` VALUES (7, 9, '静脉穿刺技术证书', '完成静脉穿刺技术培训课程并通过考核', '2025-05-07 16:38:58', '2027-05-08 16:38:58', '/certificates/cert_0007.pdf', '2025-05-08 16:38:58', '2025-05-08 16:38:58');

-- ----------------------------
-- Table structure for comments
-- ----------------------------
DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '用户ID',
  `video_id` int(11) NOT NULL COMMENT '视频ID',
  `parent_id` int(11) NULL DEFAULT NULL COMMENT '父评论ID(用于回复)',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '评论内容',
  `status` enum('pending','approved','rejected') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'approved' COMMENT '状态',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_video_id`(`video_id` ASC) USING BTREE,
  INDEX `idx_parent_id`(`parent_id` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE,
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`video_id`) REFERENCES `videos` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `comments_ibfk_3` FOREIGN KEY (`parent_id`) REFERENCES `comments` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 20 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '评论表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of comments
-- ----------------------------
INSERT INTO `comments` VALUES (1, 2, 1, NULL, '这个课程讲解非常清晰，对基础护理的理解有很大帮助', 'approved', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `comments` VALUES (2, 3, 1, 1, '同意楼上，尤其是操作示范部分非常详细', 'approved', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `comments` VALUES (3, 4, 2, NULL, '心肺复苏技术讲解很专业，但希望能有更多的实操演示', 'approved', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `comments` VALUES (4, 5, 2, 3, '可以结合模拟人进行实操演示会更好', 'approved', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `comments` VALUES (5, 3, 3, NULL, '医疗设备操作指南非常实用，对日常工作有很大帮助', 'approved', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `comments` VALUES (6, 2, 4, NULL, '沟通技巧的案例分析很到位，学到了很多实用技巧', 'approved', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `comments` VALUES (7, 4, 5, NULL, '药物使用指南内容全面，但部分内容过于专业，理解有难度', 'approved', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `comments` VALUES (8, 6, 5, 7, '建议增加一些常见问题的解答环节', 'approved', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `comments` VALUES (9, 7, 6, NULL, '创伤急救技术讲解得很清晰，案例丰富', 'approved', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `comments` VALUES (10, 8, 7, NULL, '团队协作的重要性讲解得很到位，对提升工作效率很有帮助', 'approved', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `comments` VALUES (11, 9, 8, NULL, '医疗记录规范的内容很实用，但希望能有更多实例', 'approved', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `comments` VALUES (12, 2, 9, NULL, '静脉穿刺技术讲解很详细，特别是困难穿刺的处理方法', 'approved', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `comments` VALUES (13, 3, 10, NULL, '气管插管操作视频很清晰，步骤讲解很到位', 'approved', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `comments` VALUES (14, 4, 11, NULL, '血压测量技巧视频对基础操作规范有很大帮助', 'approved', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `comments` VALUES (15, 5, 12, NULL, '糖尿病患者护理内容很专业，但希望能增加更多并发症处理的内容', 'approved', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `comments` VALUES (16, 6, 9, 12, '同意，特别是老年患者的静脉穿刺技巧很有用', 'pending', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `comments` VALUES (17, 7, 10, 13, '另外建议增加困难气道处理的更多技巧', 'approved', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `comments` VALUES (18, 8, 11, NULL, '很实用的内容，尤其是特殊人群的血压测量注意事项', 'approved', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `comments` VALUES (19, 9, 12, 15, '糖尿病足的护理内容也可以适当增加', 'approved', '2025-05-08 16:38:58', '2025-05-08 16:38:58');

-- ----------------------------
-- Table structure for instructors
-- ----------------------------
DROP TABLE IF EXISTS `instructors`;
CREATE TABLE `instructors`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '讲师姓名',
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '职称',
  `organization` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '所属机构',
  `bio` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '个人简介',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '头像URL',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '讲师表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of instructors
-- ----------------------------
INSERT INTO `instructors` VALUES (1, '王医生', '主任医师', '北京协和医院', '从事临床医学工作20年，擅长急救技术和内科疾病诊治', '/placeholder.svg?height=100&width=100', '2025-05-08 16:38:50', '2025-05-08 16:38:50');
INSERT INTO `instructors` VALUES (2, '李教授', '教授', '上海医科大学', '医学博士，从事医学教育30年，发表论文百余篇', '/placeholder.svg?height=100&width=100', '2025-05-08 16:38:50', '2025-05-08 16:38:50');
INSERT INTO `instructors` VALUES (3, '张主任', '护理部主任', '广州市第一人民医院', '从事护理工作25年，擅长护理管理和基础护理技术培训', '/placeholder.svg?height=100&width=100', '2025-05-08 16:38:50', '2025-05-08 16:38:50');
INSERT INTO `instructors` VALUES (4, '刘医生', '副主任医师', '深圳市人民医院', '心理学博士，擅长医患沟通和医疗团队建设', '/placeholder.svg?height=100&width=100', '2025-05-08 16:38:50', '2025-05-08 16:38:50');
INSERT INTO `instructors` VALUES (5, '陈医生', '主治医师', '武汉协和医院', '药学硕士，擅长急救药物使用和临床用药指导', '/placeholder.svg?height=100&width=100', '2025-05-08 16:38:50', '2025-05-08 16:38:50');

-- ----------------------------
-- Table structure for materials
-- ----------------------------
DROP TABLE IF EXISTS `materials`;
CREATE TABLE `materials`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `video_id` int(11) NULL DEFAULT NULL COMMENT '关联的视频ID',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '资料名称',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '资料描述',
  `file_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '文件URL',
  `file_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '文件类型',
  `file_size` int(11) NULL DEFAULT NULL COMMENT '文件大小(KB)',
  `access_type` enum('external','internal') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'external' COMMENT '访问类型(external:公开,internal:仅会员)',
  `download_count` int(11) NULL DEFAULT 0 COMMENT '下载次数',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_video_id`(`video_id` ASC) USING BTREE,
  INDEX `idx_access_type`(`access_type` ASC) USING BTREE,
  CONSTRAINT `materials_ibfk_1` FOREIGN KEY (`video_id`) REFERENCES `videos` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '学习资料表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of materials
-- ----------------------------
INSERT INTO `materials` VALUES (1, 1, '基础护理操作手册.pdf', '详细的基础护理操作步骤和注意事项', '/files/basic_nursing.pdf', 'pdf', 2048, 'external', 0, '2025-05-08 16:38:50', '2025-05-08 16:38:50');
INSERT INTO `materials` VALUES (2, 2, '心肺复苏操作指南.pdf', '最新版心肺复苏操作指南和流程', '/files/cpr_guide.pdf', 'pdf', 3072, 'external', 0, '2025-05-08 16:38:50', '2025-05-08 16:38:50');
INSERT INTO `materials` VALUES (3, 2, '急救药物使用手册.pdf', '常用急救药物的使用方法和注意事项', '/files/emergency_meds.pdf', 'pdf', 4096, 'internal', 0, '2025-05-08 16:38:50', '2025-05-08 16:38:50');
INSERT INTO `materials` VALUES (4, 3, '医疗设备操作手册.pdf', '常见医疗设备的操作方法和维护指南', '/files/equipment_manual.pdf', 'pdf', 5120, 'internal', 0, '2025-05-08 16:38:50', '2025-05-08 16:38:50');
INSERT INTO `materials` VALUES (5, 4, '医患沟通案例分析.pdf', '典型医患沟通案例分析和技巧总结', '/files/communication_cases.pdf', 'pdf', 2560, 'external', 0, '2025-05-08 16:38:50', '2025-05-08 16:38:50');
INSERT INTO `materials` VALUES (6, 5, '急救药物配伍禁忌.pdf', '急救药物的配伍禁忌和注意事项', '/files/drug_compatibility.pdf', 'pdf', 1536, 'internal', 0, '2025-05-08 16:38:50', '2025-05-08 16:38:50');
INSERT INTO `materials` VALUES (7, 9, '静脉穿刺技术手册.pdf', '详细的静脉穿刺步骤和技巧指南', '/files/venipuncture_manual.pdf', 'pdf', 3072, 'external', 420, '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `materials` VALUES (8, 9, '静脉解剖图谱.pdf', '上肢静脉解剖结构详解', '/files/vein_anatomy.pdf', 'pdf', 5120, 'internal', 280, '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `materials` VALUES (9, 10, '气管插管操作指南.pdf', '气管插管的标准操作流程', '/files/intubation_guide.pdf', 'pdf', 2560, 'internal', 350, '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `materials` VALUES (10, 10, '困难气道处理.pdf', '困难气道识别和处理方案', '/files/difficult_airway.pdf', 'pdf', 3584, 'internal', 270, '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `materials` VALUES (11, 11, '血压测量指南.pdf', '准确测量血压的完整指南', '/files/bp_measurement.pdf', 'pdf', 1536, 'external', 510, '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `materials` VALUES (12, 12, '糖尿病护理手册.pdf', '糖尿病患者的全面护理方案', '/files/diabetes_care_manual.pdf', 'pdf', 4096, 'internal', 190, '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `materials` VALUES (13, 12, '胰岛素使用指南.pdf', '各类胰岛素的使用方法和注意事项', '/files/insulin_guide.pdf', 'pdf', 2048, 'internal', 240, '2025-05-08 16:38:58', '2025-05-08 16:38:58');

-- ----------------------------
-- Table structure for notes
-- ----------------------------
DROP TABLE IF EXISTS `notes`;
CREATE TABLE `notes`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '用户ID',
  `video_id` int(11) NOT NULL COMMENT '视频ID',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '笔记内容',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_video_id`(`video_id` ASC) USING BTREE,
  CONSTRAINT `notes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `notes_ibfk_2` FOREIGN KEY (`video_id`) REFERENCES `videos` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '用户笔记表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of notes
-- ----------------------------
INSERT INTO `notes` VALUES (1, 2, 1, '护理操作流程：评估、计划、实施、评价', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `notes` VALUES (2, 2, 2, '心肺复苏步骤：C-A-B（胸外按压-气道-呼吸）', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `notes` VALUES (3, 3, 3, '医疗设备使用前需要进行完整的安全检查', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `notes` VALUES (4, 3, 10, '气管插管时需要注意的解剖结构标志', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `notes` VALUES (5, 4, 4, '与患者沟通的六步法：问候、介绍、询问、解释、示范、确认', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `notes` VALUES (6, 4, 5, '急救药物使用的顺序和适应症', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `notes` VALUES (7, 5, 1, '无菌操作技术的核心要点', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `notes` VALUES (8, 5, 6, '手术室环境控制的标准要求', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `notes` VALUES (9, 6, 2, '成人和儿童心肺复苏的主要区别', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `notes` VALUES (10, 7, 3, '常用医疗设备的校准方法和周期', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `notes` VALUES (11, 7, 7, '新生儿护理中的温度管理特别重要', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `notes` VALUES (12, 8, 8, '妇科检查前的患者准备工作', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `notes` VALUES (13, 8, 10, '困难气道处理的备选方案', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `notes` VALUES (14, 9, 11, '血压测量时常见的误差来源', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `notes` VALUES (15, 9, 12, '糖尿病患者的低血糖处理流程', '2025-05-08 16:38:58', '2025-05-08 16:38:58');

-- ----------------------------
-- Table structure for operation_logs
-- ----------------------------
DROP TABLE IF EXISTS `operation_logs`;
CREATE TABLE `operation_logs`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NULL DEFAULT NULL COMMENT '用户ID',
  `action` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '操作类型',
  `target_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '目标类型',
  `target_id` int(11) NULL DEFAULT NULL COMMENT '目标ID',
  `details` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '详细信息',
  `ip_address` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'IP地址',
  `user_agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '用户代理',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_action`(`action` ASC) USING BTREE,
  INDEX `idx_created_at`(`created_at` ASC) USING BTREE,
  CONSTRAINT `operation_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 25 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '操作日志表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of operation_logs
-- ----------------------------
INSERT INTO `operation_logs` VALUES (1, 2, 'login', 'user', 2, '用户登录成功', '192.168.1.101', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2025-05-08 16:38:58');
INSERT INTO `operation_logs` VALUES (2, 2, 'view', 'video', 1, '观看视频', '192.168.1.101', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2025-05-08 16:38:58');
INSERT INTO `operation_logs` VALUES (3, 2, 'download', 'material', 1, '下载学习资料', '192.168.1.101', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2025-05-08 16:38:58');
INSERT INTO `operation_logs` VALUES (4, 3, 'login', 'user', 3, '用户登录成功', '192.168.1.102', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '2025-05-08 16:38:58');
INSERT INTO `operation_logs` VALUES (5, 3, 'view', 'video', 3, '观看视频', '192.168.1.102', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '2025-05-08 16:38:58');
INSERT INTO `operation_logs` VALUES (6, 3, 'comment', 'video', 3, '发表评论', '192.168.1.102', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '2025-05-08 16:38:58');
INSERT INTO `operation_logs` VALUES (7, 4, 'login', 'user', 4, '用户登录成功', '192.168.1.103', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15', '2025-05-08 16:38:58');
INSERT INTO `operation_logs` VALUES (8, 4, 'subscribe', 'plan', 3, '订阅季度会员', '192.168.1.103', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15', '2025-05-08 16:38:58');
INSERT INTO `operation_logs` VALUES (9, 4, 'view', 'video', 5, '观看视频', '192.168.1.103', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15', '2025-05-08 16:38:58');
INSERT INTO `operation_logs` VALUES (10, 5, 'login', 'user', 5, '用户登录成功', '192.168.1.104', 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15', '2025-05-08 16:38:58');
INSERT INTO `operation_logs` VALUES (11, 5, 'rate', 'video', 6, '评分视频', '192.168.1.104', 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15', '2025-05-08 16:38:58');
INSERT INTO `operation_logs` VALUES (12, 5, 'note', 'video', 6, '添加笔记', '192.168.1.104', 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15', '2025-05-08 16:38:58');
INSERT INTO `operation_logs` VALUES (13, 1, 'login', 'user', 1, '管理员登录成功', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2025-05-08 16:38:58');
INSERT INTO `operation_logs` VALUES (14, 1, 'update', 'video', 7, '更新视频信息', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2025-05-08 16:38:58');
INSERT INTO `operation_logs` VALUES (15, 1, 'update', 'setting', 1, '更新系统设置', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2025-05-08 16:38:58');
INSERT INTO `operation_logs` VALUES (16, 6, 'login', 'user', 6, '用户登录失败，密码错误', '192.168.1.105', 'Mozilla/5.0 (Android 10; Mobile) AppleWebKit/537.36', '2025-05-08 16:38:58');
INSERT INTO `operation_logs` VALUES (17, 6, 'login', 'user', 6, '用户登录成功', '192.168.1.105', 'Mozilla/5.0 (Android 10; Mobile) AppleWebKit/537.36', '2025-05-08 16:38:58');
INSERT INTO `operation_logs` VALUES (18, 7, 'login', 'user', 7, '用户登录成功', '192.168.1.106', 'Mozilla/5.0 (Linux; Android 11; SM-G970F) AppleWebKit/537.36', '2025-05-08 16:38:58');
INSERT INTO `operation_logs` VALUES (19, 8, 'login', 'user', 8, '用户登录成功', '192.168.1.107', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/91.0.864.59', '2025-05-08 16:38:58');
INSERT INTO `operation_logs` VALUES (20, 9, 'login', 'user', 9, '用户登录成功', '192.168.1.108', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15', '2025-05-08 16:38:58');
INSERT INTO `operation_logs` VALUES (21, NULL, 'system_error', 'system', NULL, '数据库连接超时', '192.168.1.100', 'System Service', '2025-05-08 16:39:07');
INSERT INTO `operation_logs` VALUES (22, NULL, 'system_error', 'video', 15, '视频文件损坏', '192.168.1.100', 'System Service', '2025-05-08 16:39:07');
INSERT INTO `operation_logs` VALUES (23, NULL, 'security_alert', 'user', NULL, '多次登录失败尝试', '203.0.113.15', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2025-05-08 16:39:07');
INSERT INTO `operation_logs` VALUES (24, 1, 'restore', 'video', 15, '修复损坏的视频文件', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2025-05-08 16:39:07');

-- ----------------------------
-- Table structure for payments
-- ----------------------------
DROP TABLE IF EXISTS `payments`;
CREATE TABLE `payments`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '用户ID',
  `subscription_id` int(11) NULL DEFAULT NULL COMMENT '关联的订阅ID',
  `amount` decimal(10, 2) NOT NULL COMMENT '支付金额',
  `payment_method` enum('alipay','wechat','bank_card') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '支付方式',
  `transaction_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '交易ID',
  `status` enum('pending','completed','failed','refunded') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'pending' COMMENT '支付状态',
  `payment_date` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '支付时间',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `subscription_id`(`subscription_id` ASC) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE,
  INDEX `idx_payment_date`(`payment_date` ASC) USING BTREE,
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '支付记录表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of payments
-- ----------------------------
INSERT INTO `payments` VALUES (1, 2, 1, 39.00, 'alipay', 'ALI202501010001', 'completed', '2025-04-23 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `payments` VALUES (2, 3, 2, 299.00, 'wechat', 'WX202501010002', 'completed', '2025-03-08 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `payments` VALUES (3, 4, 3, 99.00, 'bank_card', 'BANK202501010003', 'completed', '2025-04-08 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `payments` VALUES (4, 5, 4, 39.00, 'alipay', 'ALI202501010004', 'completed', '2025-04-28 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `payments` VALUES (5, 6, 5, 299.00, 'wechat', 'WX202501010005', 'completed', '2025-02-08 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `payments` VALUES (6, 7, 6, 39.00, 'alipay', 'ALI202501010006', 'completed', '2025-05-03 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `payments` VALUES (7, 8, 7, 99.00, 'bank_card', 'BANK202501010007', 'completed', '2025-03-08 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `payments` VALUES (8, 9, 8, 299.00, 'wechat', 'WX202501010008', 'completed', '2025-05-07 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `payments` VALUES (9, 2, NULL, 39.00, 'alipay', 'ALI202502010001', 'failed', '2025-04-22 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `payments` VALUES (10, 5, NULL, 99.00, 'bank_card', 'BANK202502010002', 'refunded', '2025-04-18 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `payments` VALUES (11, 2, NULL, 39.00, 'alipay', 'ALI202503010001', 'pending', '2025-05-08 16:39:07', '2025-05-08 16:39:07', '2025-05-08 16:39:07');
INSERT INTO `payments` VALUES (12, 3, NULL, 99.00, 'wechat', 'WX202503010002', 'failed', '2025-05-05 16:39:07', '2025-05-08 16:39:07', '2025-05-08 16:39:07');
INSERT INTO `payments` VALUES (13, 4, NULL, 299.00, 'bank_card', 'BANK202503010003', 'refunded', '2025-04-23 16:39:07', '2025-05-08 16:39:07', '2025-05-08 16:39:07');

-- ----------------------------
-- Table structure for ratings
-- ----------------------------
DROP TABLE IF EXISTS `ratings`;
CREATE TABLE `ratings`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '用户ID',
  `video_id` int(11) NOT NULL COMMENT '视频ID',
  `score` tinyint(4) NOT NULL COMMENT '评分(1-5)',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_user_video`(`user_id` ASC, `video_id` ASC) USING BTREE,
  INDEX `idx_video_id`(`video_id` ASC) USING BTREE,
  CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`video_id`) REFERENCES `videos` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 20 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '视频评分表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ratings
-- ----------------------------
INSERT INTO `ratings` VALUES (1, 2, 1, 5, '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `ratings` VALUES (2, 2, 2, 4, '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `ratings` VALUES (3, 2, 9, 5, '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `ratings` VALUES (4, 3, 1, 4, '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `ratings` VALUES (5, 3, 3, 5, '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `ratings` VALUES (6, 3, 10, 4, '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `ratings` VALUES (7, 4, 2, 3, '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `ratings` VALUES (8, 4, 4, 5, '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `ratings` VALUES (9, 4, 5, 4, '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `ratings` VALUES (10, 5, 1, 5, '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `ratings` VALUES (11, 5, 6, 4, '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `ratings` VALUES (12, 5, 9, 5, '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `ratings` VALUES (13, 6, 2, 3, '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `ratings` VALUES (14, 7, 3, 5, '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `ratings` VALUES (15, 7, 7, 4, '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `ratings` VALUES (16, 8, 8, 4, '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `ratings` VALUES (17, 8, 10, 5, '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `ratings` VALUES (18, 9, 11, 4, '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `ratings` VALUES (19, 9, 12, 5, '2025-05-08 16:38:58', '2025-05-08 16:38:58');

-- ----------------------------
-- Table structure for settings
-- ----------------------------
DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '设置键',
  `setting_value` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '设置值',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '描述',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `setting_key`(`setting_key` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '系统设置表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of settings
-- ----------------------------
INSERT INTO `settings` VALUES (1, 'site_name', '医护培训', '网站名称', '2025-05-08 16:38:50', '2025-05-08 16:38:50');
INSERT INTO `settings` VALUES (2, 'site_description', '专业医护培训平台，提供高质量的医护培训课程', '网站描述', '2025-05-08 16:38:50', '2025-05-08 16:38:50');
INSERT INTO `settings` VALUES (3, 'free_preview_time', '300', '非会员预览时间(秒)', '2025-05-08 16:38:50', '2025-05-08 16:38:50');
INSERT INTO `settings` VALUES (4, 'monthly_price', '39', '月度会员价格', '2025-05-08 16:38:50', '2025-05-08 16:38:50');
INSERT INTO `settings` VALUES (5, 'quarterly_price', '99', '季度会员价格', '2025-05-08 16:38:50', '2025-05-08 16:38:50');
INSERT INTO `settings` VALUES (6, 'yearly_price', '299', '年度会员价格', '2025-05-08 16:38:50', '2025-05-08 16:38:50');

-- ----------------------------
-- Table structure for subscriptions
-- ----------------------------
DROP TABLE IF EXISTS `subscriptions`;
CREATE TABLE `subscriptions`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '用户ID',
  `plan_type` enum('monthly','quarterly','yearly') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '订阅类型',
  `start_date` datetime NOT NULL COMMENT '开始日期',
  `end_date` datetime NOT NULL COMMENT '结束日期',
  `status` enum('active','expired','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'active' COMMENT '状态',
  `auto_renew` tinyint(1) NULL DEFAULT 0 COMMENT '是否自动续费',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE,
  INDEX `idx_end_date`(`end_date` ASC) USING BTREE,
  CONSTRAINT `subscriptions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '会员订阅表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of subscriptions
-- ----------------------------
INSERT INTO `subscriptions` VALUES (1, 2, 'monthly', '2025-04-23 16:38:58', '2025-05-23 16:38:58', 'active', 1, '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `subscriptions` VALUES (2, 3, 'yearly', '2025-03-08 16:38:58', '2026-03-08 16:38:58', 'active', 1, '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `subscriptions` VALUES (3, 4, 'quarterly', '2025-04-08 16:38:58', '2025-07-08 16:38:58', 'active', 0, '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `subscriptions` VALUES (4, 5, 'monthly', '2025-04-28 16:38:58', '2025-05-28 16:38:58', 'active', 1, '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `subscriptions` VALUES (5, 6, 'yearly', '2025-02-08 16:38:58', '2025-04-08 16:38:58', 'expired', 0, '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `subscriptions` VALUES (6, 7, 'monthly', '2025-05-03 16:38:58', '2025-06-02 16:38:58', 'active', 1, '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `subscriptions` VALUES (7, 8, 'quarterly', '2025-03-08 16:38:58', '2025-06-08 16:38:58', 'active', 1, '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `subscriptions` VALUES (8, 9, 'yearly', '2025-05-07 16:38:58', '2026-05-07 16:38:58', 'active', 1, '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `subscriptions` VALUES (9, 10, 'monthly', '2025-05-08 16:39:07', '2025-05-15 16:39:07', 'active', 0, '2025-05-08 16:39:07', '2025-05-08 16:39:07');
INSERT INTO `subscriptions` VALUES (10, 11, 'monthly', '2025-04-09 16:39:07', '2025-05-09 16:39:07', 'active', 0, '2025-05-08 16:39:07', '2025-05-08 16:39:07');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `member_number` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '会员编号',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '姓名',
  `id_number` varchar(18) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '身份证号',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '手机号',
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '邮箱',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '密码(加密存储)',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '头像URL',
  `status` enum('active','inactive','banned') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'active' COMMENT '状态',
  `role` enum('user','admin','super_admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'user' COMMENT '角色',
  `register_date` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
  `last_login` datetime NULL DEFAULT NULL COMMENT '最后登录时间',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `member_number`(`member_number` ASC) USING BTREE,
  UNIQUE INDEX `id_number`(`id_number` ASC) USING BTREE,
  UNIQUE INDEX `phone`(`phone` ASC) USING BTREE,
  UNIQUE INDEX `email`(`email` ASC) USING BTREE,
  INDEX `idx_member_number`(`member_number` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE,
  INDEX `idx_role`(`role` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '用户表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'A20250001', '系统管理员', '110101199001010001', '13800000001', 'admin@example.com', '$2a$10$xVLXqSkHrJ7MHihBJIxAj.Qe7Zs5EDwuFVYaRnpVCQx3pKVIlPBey', NULL, 'active', 'super_admin', '2025-01-01 00:00:00', NULL, '2025-05-08 16:38:50', '2025-05-08 16:38:50');
INSERT INTO `users` VALUES (2, 'M20250011', '张伟', '110101199101010002', '13800000002', 'zhangwei@example.com', '$2a$10$xVLXqSkHrJ7MHihBJIxAj.Qe7Zs5EDwuFVYaRnpVCQx3pKVIlPBey', '/avatars/user1.jpg', 'active', 'user', '2025-04-08 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `users` VALUES (3, 'M20250012', '王芳', '110101199202020003', '13800000003', 'wangfang@example.com', '$2a$10$xVLXqSkHrJ7MHihBJIxAj.Qe7Zs5EDwuFVYaRnpVCQx3pKVIlPBey', '/avatars/user2.jpg', 'active', 'user', '2025-04-13 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `users` VALUES (4, 'M20250013', '李娜', '110101199303030004', '13800000004', 'lina@example.com', '$2a$10$xVLXqSkHrJ7MHihBJIxAj.Qe7Zs5EDwuFVYaRnpVCQx3pKVIlPBey', '/avatars/user3.jpg', 'active', 'user', '2025-04-18 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `users` VALUES (5, 'M20250014', '赵强', '110101199404040005', '13800000005', 'zhaoqiang@example.com', '$2a$10$xVLXqSkHrJ7MHihBJIxAj.Qe7Zs5EDwuFVYaRnpVCQx3pKVIlPBey', '/avatars/user4.jpg', 'active', 'user', '2025-04-23 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `users` VALUES (6, 'M20250015', '刘洋', '110101199505050006', '13800000006', 'liuyang@example.com', '$2a$10$xVLXqSkHrJ7MHihBJIxAj.Qe7Zs5EDwuFVYaRnpVCQx3pKVIlPBey', '/avatars/user5.jpg', 'active', 'user', '2025-04-28 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `users` VALUES (7, 'M20250016', '陈明', '110101199606060007', '13800000007', 'chenming@example.com', '$2a$10$xVLXqSkHrJ7MHihBJIxAj.Qe7Zs5EDwuFVYaRnpVCQx3pKVIlPBey', '/avatars/user6.jpg', 'inactive', 'user', '2025-03-09 16:38:58', '2025-04-08 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `users` VALUES (8, 'M20250017', '杨丽', '110101199707070008', '13800000008', 'yangli@example.com', '$2a$10$xVLXqSkHrJ7MHihBJIxAj.Qe7Zs5EDwuFVYaRnpVCQx3pKVIlPBey', '/avatars/user7.jpg', 'active', 'user', '2025-05-03 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `users` VALUES (9, 'M20250018', '黄海', '110101199808080009', '13800000009', 'huanghai@example.com', '$2a$10$xVLXqSkHrJ7MHihBJIxAj.Qe7Zs5EDwuFVYaRnpVCQx3pKVIlPBey', '/avatars/user8.jpg', 'active', 'user', '2025-05-05 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `users` VALUES (10, 'M20250019', '周燕', '110101199909090010', '13800000010', 'zhouyan@example.com', '$2a$10$xVLXqSkHrJ7MHihBJIxAj.Qe7Zs5EDwuFVYaRnpVCQx3pKVIlPBey', '/avatars/user9.jpg', 'active', 'user', '2025-05-06 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `users` VALUES (11, 'A20250012', '管理员小李', '110101199010100011', '13800000011', 'admin2@example.com', '$2a$10$xVLXqSkHrJ7MHihBJIxAj.Qe7Zs5EDwuFVYaRnpVCQx3pKVIlPBey', '/avatars/admin2.jpg', 'active', 'admin', '2025-03-09 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');

-- ----------------------------
-- Table structure for video_categories
-- ----------------------------
DROP TABLE IF EXISTS `video_categories`;
CREATE TABLE `video_categories`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '分类名称',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '分类描述',
  `parent_id` int(11) NULL DEFAULT NULL COMMENT '父分类ID',
  `display_order` int(11) NULL DEFAULT 0 COMMENT '显示顺序',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_parent_id`(`parent_id` ASC) USING BTREE,
  INDEX `idx_display_order`(`display_order` ASC) USING BTREE,
  CONSTRAINT `video_categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `video_categories` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '视频分类表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of video_categories
-- ----------------------------
INSERT INTO `video_categories` VALUES (1, '基础护理', '基础护理技能和知识', NULL, 1, '2025-05-08 16:38:50', '2025-05-08 16:38:50');
INSERT INTO `video_categories` VALUES (2, '急救技术', '各类急救技术和方法', NULL, 2, '2025-05-08 16:38:50', '2025-05-08 16:38:50');
INSERT INTO `video_categories` VALUES (3, '医疗设备', '医疗设备使用和维护', NULL, 3, '2025-05-08 16:38:50', '2025-05-08 16:38:50');
INSERT INTO `video_categories` VALUES (4, '沟通技巧', '医患沟通和团队协作', NULL, 4, '2025-05-08 16:38:50', '2025-05-08 16:38:50');
INSERT INTO `video_categories` VALUES (5, '专科护理', '各专科护理技能和知识', NULL, 5, '2025-05-08 16:38:50', '2025-05-08 16:38:50');
INSERT INTO `video_categories` VALUES (6, '内科护理', '内科相关护理技能', 5, 1, '2025-05-08 16:38:50', '2025-05-08 16:38:50');
INSERT INTO `video_categories` VALUES (7, '外科护理', '外科相关护理技能', 5, 2, '2025-05-08 16:38:50', '2025-05-08 16:38:50');
INSERT INTO `video_categories` VALUES (8, '儿科护理', '儿科相关护理技能', 5, 3, '2025-05-08 16:38:50', '2025-05-08 16:38:50');
INSERT INTO `video_categories` VALUES (9, '妇产科护理', '妇产科相关护理技能', 5, 4, '2025-05-08 16:38:50', '2025-05-08 16:38:50');

-- ----------------------------
-- Table structure for video_tag_relations
-- ----------------------------
DROP TABLE IF EXISTS `video_tag_relations`;
CREATE TABLE `video_tag_relations`  (
  `video_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  PRIMARY KEY (`video_id`, `tag_id`) USING BTREE,
  INDEX `tag_id`(`tag_id` ASC) USING BTREE,
  CONSTRAINT `video_tag_relations_ibfk_1` FOREIGN KEY (`video_id`) REFERENCES `videos` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `video_tag_relations_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `video_tags` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '视频-标签关联表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of video_tag_relations
-- ----------------------------
INSERT INTO `video_tag_relations` VALUES (1, 1);
INSERT INTO `video_tag_relations` VALUES (3, 1);
INSERT INTO `video_tag_relations` VALUES (6, 1);
INSERT INTO `video_tag_relations` VALUES (8, 1);
INSERT INTO `video_tag_relations` VALUES (9, 1);
INSERT INTO `video_tag_relations` VALUES (11, 1);
INSERT INTO `video_tag_relations` VALUES (13, 1);
INSERT INTO `video_tag_relations` VALUES (17, 1);
INSERT INTO `video_tag_relations` VALUES (2, 2);
INSERT INTO `video_tag_relations` VALUES (5, 2);
INSERT INTO `video_tag_relations` VALUES (6, 2);
INSERT INTO `video_tag_relations` VALUES (10, 2);
INSERT INTO `video_tag_relations` VALUES (14, 2);
INSERT INTO `video_tag_relations` VALUES (18, 2);
INSERT INTO `video_tag_relations` VALUES (3, 3);
INSERT INTO `video_tag_relations` VALUES (15, 3);
INSERT INTO `video_tag_relations` VALUES (19, 3);
INSERT INTO `video_tag_relations` VALUES (4, 4);
INSERT INTO `video_tag_relations` VALUES (7, 4);
INSERT INTO `video_tag_relations` VALUES (9, 4);
INSERT INTO `video_tag_relations` VALUES (16, 4);
INSERT INTO `video_tag_relations` VALUES (20, 4);
INSERT INTO `video_tag_relations` VALUES (4, 5);
INSERT INTO `video_tag_relations` VALUES (7, 5);
INSERT INTO `video_tag_relations` VALUES (11, 5);
INSERT INTO `video_tag_relations` VALUES (5, 6);
INSERT INTO `video_tag_relations` VALUES (10, 6);
INSERT INTO `video_tag_relations` VALUES (15, 6);
INSERT INTO `video_tag_relations` VALUES (16, 6);
INSERT INTO `video_tag_relations` VALUES (18, 6);
INSERT INTO `video_tag_relations` VALUES (1, 7);
INSERT INTO `video_tag_relations` VALUES (8, 7);
INSERT INTO `video_tag_relations` VALUES (2, 8);
INSERT INTO `video_tag_relations` VALUES (12, 8);
INSERT INTO `video_tag_relations` VALUES (19, 8);
INSERT INTO `video_tag_relations` VALUES (20, 8);
INSERT INTO `video_tag_relations` VALUES (12, 9);
INSERT INTO `video_tag_relations` VALUES (13, 9);
INSERT INTO `video_tag_relations` VALUES (17, 9);
INSERT INTO `video_tag_relations` VALUES (14, 10);

-- ----------------------------
-- Table structure for video_tags
-- ----------------------------
DROP TABLE IF EXISTS `video_tags`;
CREATE TABLE `video_tags`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '标签名称',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `idx_name`(`name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 30 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '视频标签表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of video_tags
-- ----------------------------
INSERT INTO `video_tags` VALUES (1, '基础技能', '2025-05-08 16:38:50', '2025-05-08 16:38:50');
INSERT INTO `video_tags` VALUES (2, '急救', '2025-05-08 16:38:50', '2025-05-08 16:38:50');
INSERT INTO `video_tags` VALUES (3, '设备操作', '2025-05-08 16:38:50', '2025-05-08 16:38:50');
INSERT INTO `video_tags` VALUES (4, '沟通', '2025-05-08 16:38:50', '2025-05-08 16:38:50');
INSERT INTO `video_tags` VALUES (5, '团队协作', '2025-05-08 16:38:50', '2025-05-08 16:38:50');
INSERT INTO `video_tags` VALUES (6, '药物使用', '2025-05-08 16:38:50', '2025-05-08 16:38:50');
INSERT INTO `video_tags` VALUES (7, '记录规范', '2025-05-08 16:38:50', '2025-05-08 16:38:50');
INSERT INTO `video_tags` VALUES (8, '心肺复苏', '2025-05-08 16:38:50', '2025-05-08 16:38:50');
INSERT INTO `video_tags` VALUES (9, '内科护理', '2025-05-08 16:39:07', '2025-05-08 16:39:07');
INSERT INTO `video_tags` VALUES (10, '外科护理', '2025-05-08 16:39:07', '2025-05-08 16:39:07');
INSERT INTO `video_tags` VALUES (11, '儿科护理', '2025-05-08 16:39:07', '2025-05-08 16:39:07');
INSERT INTO `video_tags` VALUES (12, '妇产科护理', '2025-05-08 16:39:07', '2025-05-08 16:39:07');
INSERT INTO `video_tags` VALUES (13, '老年护理', '2025-05-08 16:39:07', '2025-05-08 16:39:07');
INSERT INTO `video_tags` VALUES (14, '危重护理', '2025-05-08 16:39:07', '2025-05-08 16:39:07');
INSERT INTO `video_tags` VALUES (15, '护理文书', '2025-05-08 16:39:07', '2025-05-08 16:39:07');
INSERT INTO `video_tags` VALUES (16, '患者教育', '2025-05-08 16:39:07', '2025-05-08 16:39:07');
INSERT INTO `video_tags` VALUES (17, '疾病预防', '2025-05-08 16:39:07', '2025-05-08 16:39:07');
INSERT INTO `video_tags` VALUES (18, '康复指导', '2025-05-08 16:39:07', '2025-05-08 16:39:07');

-- ----------------------------
-- Table structure for videos
-- ----------------------------
DROP TABLE IF EXISTS `videos`;
CREATE TABLE `videos`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '视频标题',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '视频描述',
  `category_id` int(11) NULL DEFAULT NULL COMMENT '分类ID',
  `instructor_id` int(11) NULL DEFAULT NULL COMMENT '讲师ID',
  `duration` int(11) NOT NULL COMMENT '时长(秒)',
  `video_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '视频URL',
  `thumbnail_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '缩略图URL',
  `access_type` enum('external','internal') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'external' COMMENT '访问类型(external:非会员可观看5分钟,internal:仅会员)',
  `views` int(11) NULL DEFAULT 0 COMMENT '观看次数',
  `status` enum('draft','published','archived') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'published' COMMENT '状态',
  `upload_date` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '上传时间',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_category_id`(`category_id` ASC) USING BTREE,
  INDEX `idx_instructor_id`(`instructor_id` ASC) USING BTREE,
  INDEX `idx_access_type`(`access_type` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE,
  FULLTEXT INDEX `ft_video_search`(`title`, `description`),
  CONSTRAINT `videos_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `video_categories` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT,
  CONSTRAINT `videos_ibfk_2` FOREIGN KEY (`instructor_id`) REFERENCES `instructors` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 21 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '视频表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of videos
-- ----------------------------
INSERT INTO `videos` VALUES (1, '基础护理技能培训', '学习基本的护理技能和操作流程，适合初级医护人员', 1, 3, 2700, '/placeholder.mp4', '/placeholder.svg?height=200&width=350', 'external', 1245, 'published', '2025-05-08 16:38:50', '2025-05-08 16:38:50', '2025-05-08 16:38:50');
INSERT INTO `videos` VALUES (2, '高级心肺复苏技术', '掌握最新的心肺复苏技术和急救方法', 2, 2, 3600, '/placeholder.mp4', '/placeholder.svg?height=200&width=350', 'external', 987, 'published', '2025-05-08 16:38:50', '2025-05-08 16:38:50', '2025-05-08 16:38:50');
INSERT INTO `videos` VALUES (3, '医疗设备操作指南', '详细讲解常见医疗设备的使用方法和注意事项', 3, 3, 3000, '/placeholder.mp4', '/placeholder.svg?height=200&width=350', 'internal', 876, 'published', '2025-05-08 16:38:50', '2025-05-08 16:38:50', '2025-05-08 16:38:50');
INSERT INTO `videos` VALUES (4, '患者沟通技巧', '提升与患者沟通的能力，建立良好的医患关系', 4, 4, 2400, '/placeholder.mp4', '/placeholder.svg?height=200&width=350', 'external', 765, 'published', '2025-05-08 16:38:50', '2025-05-08 16:38:50', '2025-05-08 16:38:50');
INSERT INTO `videos` VALUES (5, '急救药物使用指南', '详细讲解急救药物的使用方法、适应症和注意事项', 2, 5, 2100, '/placeholder.mp4', '/placeholder.svg?height=200&width=350', 'internal', 654, 'published', '2025-05-08 16:38:50', '2025-05-08 16:38:50', '2025-05-08 16:38:50');
INSERT INTO `videos` VALUES (6, '创伤急救技术', '学习各类创伤的急救处理方法和技巧', 2, 1, 2700, '/placeholder.mp4', '/placeholder.svg?height=200&width=350', 'external', 543, 'published', '2025-05-08 16:38:50', '2025-05-08 16:38:50', '2025-05-08 16:38:50');
INSERT INTO `videos` VALUES (7, '医疗团队协作', '提升医疗团队协作能力，提高工作效率', 4, 4, 1800, '/placeholder.mp4', '/placeholder.svg?height=200&width=350', 'internal', 432, 'published', '2025-05-08 16:38:50', '2025-05-08 16:38:50', '2025-05-08 16:38:50');
INSERT INTO `videos` VALUES (8, '医疗记录规范', '学习医疗记录的书写规范和注意事项', 1, 2, 1500, '/placeholder.mp4', '/placeholder.svg?height=200&width=350', 'external', 321, 'published', '2025-05-08 16:38:50', '2025-05-08 16:38:50', '2025-05-08 16:38:50');
INSERT INTO `videos` VALUES (9, '内科护理核心技能', '详细讲解内科护理的核心技能和常见问题处理方法', 6, 1, 3200, '/videos/internal_nursing.mp4', '/thumbnails/internal_nursing.jpg', 'internal', 1420, 'published', '2025-04-23 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `videos` VALUES (10, '外科换药技术进阶', '学习外科换药的高级技巧和无菌操作要点', 7, 3, 2800, '/videos/surgical_dressing.mp4', '/thumbnails/surgical_dressing.jpg', 'internal', 1150, 'published', '2025-04-24 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `videos` VALUES (11, '儿科用药安全', '儿科常用药物的使用方法、剂量计算和安全注意事项', 8, 5, 2500, '/videos/pediatric_medication.mp4', '/thumbnails/pediatric_medication.jpg', 'external', 980, 'published', '2025-04-25 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `videos` VALUES (12, '产科急救处理', '产科常见急症的识别和紧急处理方法', 9, 1, 3000, '/videos/obstetric_emergency.mp4', '/thumbnails/obstetric_emergency.jpg', 'internal', 850, 'published', '2025-04-26 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `videos` VALUES (13, '心电图解读基础', '学习心电图的基本原理和常见异常心电图的识别', 6, 2, 2600, '/videos/ecg_basics.mp4', '/thumbnails/ecg_basics.jpg', 'external', 1680, 'published', '2025-04-27 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `videos` VALUES (14, '手术室无菌技术', '手术室无菌技术的规范和操作要点', 7, 3, 2900, '/videos/sterile_technique.mp4', '/thumbnails/sterile_technique.jpg', 'internal', 790, 'published', '2025-04-28 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `videos` VALUES (15, '新生儿护理专题', '新生儿护理的特殊技巧和注意事项', 8, 4, 2400, '/videos/neonatal_care.mp4', '/thumbnails/neonatal_care.jpg', 'external', 1200, 'published', '2025-04-29 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `videos` VALUES (16, '妇科检查技术', '妇科检查的规范操作和患者舒适度管理', 9, 3, 2200, '/videos/gynecological_exam.mp4', '/thumbnails/gynecological_exam.jpg', 'internal', 670, 'published', '2025-04-30 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `videos` VALUES (17, '静脉穿刺技术', '各种静脉穿刺技术的详细讲解和实践技巧', 1, 5, 2700, '/videos/venipuncture.mp4', '/thumbnails/venipuncture.jpg', 'external', 1550, 'published', '2025-05-01 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `videos` VALUES (18, '气管插管操作', '气管插管的正确操作步骤和常见问题处理', 2, 1, 3100, '/videos/intubation.mp4', '/thumbnails/intubation.jpg', 'internal', 920, 'published', '2025-05-02 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `videos` VALUES (19, '血压测量技巧', '准确测量血压的技巧和常见误差分析', 1, 4, 1800, '/videos/blood_pressure.mp4', '/thumbnails/blood_pressure.jpg', 'external', 1380, 'published', '2025-05-03 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `videos` VALUES (20, '糖尿病患者护理', '糖尿病患者的专业护理和健康教育', 6, 2, 3400, '/videos/diabetes_care.mp4', '/thumbnails/diabetes_care.jpg', 'internal', 720, 'published', '2025-05-04 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');

-- ----------------------------
-- Table structure for watch_history
-- ----------------------------
DROP TABLE IF EXISTS `watch_history`;
CREATE TABLE `watch_history`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '用户ID',
  `video_id` int(11) NOT NULL COMMENT '视频ID',
  `progress` int(11) NULL DEFAULT 0 COMMENT '观看进度(秒)',
  `completed` tinyint(1) NULL DEFAULT 0 COMMENT '是否完成观看',
  `last_watched` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '最后观看时间',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_user_video`(`user_id` ASC, `video_id` ASC) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_video_id`(`video_id` ASC) USING BTREE,
  INDEX `idx_last_watched`(`last_watched` ASC) USING BTREE,
  CONSTRAINT `watch_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `watch_history_ibfk_2` FOREIGN KEY (`video_id`) REFERENCES `videos` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 22 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '视频观看记录表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of watch_history
-- ----------------------------
INSERT INTO `watch_history` VALUES (1, 2, 1, 2500, 1, '2025-04-28 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `watch_history` VALUES (2, 2, 2, 3200, 1, '2025-04-29 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `watch_history` VALUES (3, 2, 9, 1200, 0, '2025-05-06 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `watch_history` VALUES (4, 3, 3, 2800, 1, '2025-04-23 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `watch_history` VALUES (5, 3, 10, 1500, 0, '2025-05-03 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `watch_history` VALUES (6, 3, 12, 3000, 1, '2025-05-07 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `watch_history` VALUES (7, 4, 4, 2700, 1, '2025-04-26 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `watch_history` VALUES (8, 4, 5, 2000, 1, '2025-04-30 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `watch_history` VALUES (9, 4, 11, 900, 0, '2025-05-05 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `watch_history` VALUES (10, 5, 1, 2000, 1, '2025-04-24 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `watch_history` VALUES (11, 5, 6, 2500, 1, '2025-05-01 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `watch_history` VALUES (12, 5, 9, 2600, 1, '2025-05-06 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `watch_history` VALUES (13, 6, 2, 1500, 0, '2025-03-29 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `watch_history` VALUES (14, 7, 3, 2300, 1, '2025-05-04 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `watch_history` VALUES (15, 7, 7, 2200, 1, '2025-05-06 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `watch_history` VALUES (16, 8, 8, 1800, 1, '2025-05-03 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `watch_history` VALUES (17, 8, 10, 2800, 1, '2025-05-07 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `watch_history` VALUES (18, 9, 11, 1700, 1, '2025-05-07 16:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');
INSERT INTO `watch_history` VALUES (19, 9, 12, 3000, 1, '2025-05-08 04:38:58', '2025-05-08 16:38:58', '2025-05-08 16:38:58');

SET FOREIGN_KEY_CHECKS = 1;
