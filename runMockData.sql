-- 主文件：按顺序执行所有模拟数据脚本

-- 注意：执行本脚本前，请确保已创建数据库并建立了表结构
-- 本脚本将依次导入所有模拟数据

-- 1. 导入基础数据（已在表结构文件中）
-- 这部分包括基础的视频分类、讲师、视频、标签等数据

-- 2. 导入更多用户和视频数据
SOURCE mock_more_data.sql;

-- 3. 导入特殊场景和补充数据
SOURCE mock_more_data_part2.sql;

-- 4. 确认数据导入完成
SELECT 'Mock data imported successfully!' AS Result; 