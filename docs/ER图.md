# 医护培训平台 — 全局 ER 图

```mermaid
erDiagram
    %% ================================================================
    %% 用户管理模块
    %% ================================================================
    USERS {
        int id PK "用户ID"
        varchar member_number UQ "会员编号"
        varchar name "姓名"
        varchar id_number UQ "身份证号"
        varchar phone UQ "手机号"
        varchar email UQ "邮箱"
        varchar password "密码"
        varchar avatar "头像"
        enum status "状态"
        enum role "角色"
        datetime register_date "注册时间"
        datetime last_login "最后登录"
        varchar membership_type "会员类型"
        datetime membership_start_date "会员开始"
        datetime membership_expire_date "会员到期"
    }

    %% ================================================================
    %% 会员管理模块
    %% ================================================================
    SUBSCRIPTIONS {
        int id PK "订阅ID"
        int user_id FK "用户ID"
        enum plan_type "订阅类型"
        datetime start_date "开始日期"
        datetime end_date "结束日期"
        enum status "状态"
        tinyint auto_renew "自动续费"
    }

    PAYMENTS {
        int id PK "支付ID"
        int user_id FK "用户ID"
        int subscription_id FK "订阅ID"
        decimal amount "金额"
        enum payment_method "支付方式"
        varchar transaction_id "交易ID"
        enum status "支付状态"
        datetime payment_date "支付时间"
    }

    %% ================================================================
    %% 内容管理模块
    %% ================================================================
    INSTRUCTORS {
        int id PK "讲师ID"
        varchar name "姓名"
        varchar title "职称"
        varchar organization "所属机构"
        text bio "个人简介"
        varchar avatar "头像"
    }

    VIDEO_CATEGORIES {
        int id PK "分类ID"
        varchar name "分类名称"
        text description "描述"
        int parent_id FK "父分类ID"
        int display_order "显示顺序"
    }

    VIDEO_TAGS {
        int id PK "标签ID"
        varchar name UQ "标签名称"
    }

    VIDEO_TAG_RELATIONS {
        int video_id PK FK "视频ID"
        int tag_id PK FK "标签ID"
    }

    VIDEOS {
        int id PK "视频ID"
        varchar title "标题"
        text description "描述"
        int category_id FK "分类ID"
        int instructor_id FK "讲师ID"
        int duration "时长"
        varchar video_url "视频URL"
        varchar thumbnail_url "缩略图"
        enum access_type "访问类型"
        int views "观看次数"
        enum status "状态"
        datetime upload_date "上传时间"
    }

    MATERIALS {
        int id PK "资料ID"
        int video_id FK "视频ID"
        varchar name "资料名称"
        text description "描述"
        varchar file_url "文件URL"
        varchar file_type "文件类型"
        int file_size "文件大小"
        enum access_type "访问类型"
        int download_count "下载次数"
    }

    %% ================================================================
    %% 用户互动模块
    %% ================================================================
    COMMENTS {
        int id PK "评论ID"
        int user_id FK "用户ID"
        int video_id FK "视频ID"
        int parent_id FK "父评论ID"
        text content "评论内容"
        enum status "状态"
    }

    RATINGS {
        int id PK "评分ID"
        int user_id FK "用户ID"
        int video_id FK "视频ID"
        tinyint score "评分1-5"
    }

    NOTES {
        int id PK "笔记ID"
        int user_id FK "用户ID"
        int video_id FK "视频ID"
        text content "笔记内容"
    }

    WATCH_HISTORY {
        int id PK "记录ID"
        int user_id FK "用户ID"
        int video_id FK "视频ID"
        int progress "观看进度"
        tinyint completed "是否完成"
        datetime last_watched "最后观看"
    }

    %% ================================================================
    %% 系统管理模块
    %% ================================================================
    CERTIFICATES {
        int id PK "证书ID"
        int user_id FK "用户ID"
        varchar title "证书标题"
        text description "描述"
        datetime issue_date "颁发日期"
        datetime expiry_date "过期日期"
        varchar certificate_url "证书URL"
    }

    OPERATION_LOGS {
        int id PK "日志ID"
        int user_id FK "用户ID"
        varchar action "操作类型"
        varchar target_type "目标类型"
        int target_id "目标ID"
        text details "详情"
        varchar ip_address "IP"
        text user_agent "用户代理"
    }

    SETTINGS {
        int id PK "设置ID"
        varchar setting_key UQ "设置键"
        text setting_value "设置值"
        varchar description "描述"
    }

    %% ================================================================
    %% 关系连线
    %% ================================================================

    %% 用户 → 会员管理
    USERS ||--o{ SUBSCRIPTIONS : "拥有订阅"
    USERS ||--o{ PAYMENTS : "发起支付"
    SUBSCRIPTIONS ||--o{ PAYMENTS : "关联支付"

    %% 用户 → 内容管理
    USERS ||--o{ CERTIFICATES : "获得证书"

    %% 用户 → 互动
    USERS ||--o{ COMMENTS : "发表评论"
    USERS ||--o{ RATINGS : "评分视频"
    USERS ||--o{ NOTES : "记录笔记"
    USERS ||--o{ WATCH_HISTORY : "观看记录"

    %% 视频 → 核心
    INSTRUCTORS ||--o{ VIDEOS : "讲授"
    VIDEO_CATEGORIES ||--o{ VIDEOS : "分类"
    VIDEO_CATEGORIES ||--o| VIDEO_CATEGORIES : "子分类"
    VIDEOS ||--o{ VIDEO_TAG_RELATIONS : "打标签"
    VIDEO_TAGS ||--o{ VIDEO_TAG_RELATIONS : "被标记"

    %% 视频 → 互动
    VIDEOS ||--o{ COMMENTS : "被评论"
    COMMENTS ||--o| COMMENTS : "被回复"
    VIDEOS ||--o{ RATINGS : "被评分"
    VIDEOS ||--o{ MATERIALS : "关联资料"
    VIDEOS ||--o{ NOTES : "被笔记"
    VIDEOS ||--o{ WATCH_HISTORY : "被观看"

    %% 用户 → 日志
    USERS ||--o{ OPERATION_LOGS : "操作日志"
```

---

## 模块说明

| 模块 | 颜色 | 表 |
|------|------|-----|
| **用户管理** | 蓝色 | users |
| **会员管理** | 绿色 | subscriptions, payments |
| **内容管理** | 橙色 | videos, instructors, video_categories, video_tags, video_tag_relations, materials |
| **用户互动** | 紫色 | comments, ratings, notes, watch_history |
| **系统管理** | 灰色 | certificates, operation_logs, settings |

---

## 关系速查

| 关系类型 | 起点 | 终点 | 说明 |
|----------|------|------|------|
| 用户-订阅 | USERS | SUBSCRIPTIONS | 1:N |
| 用户-支付 | USERS | PAYMENTS | 1:N |
| 订阅-支付 | SUBSCRIPTIONS | PAYMENTS | 1:N (可选) |
| 讲师-视频 | INSTRUCTORS | VIDEOS | 1:N |
| 分类-视频 | VIDEO_CATEGORIES | VIDEOS | 1:N |
| 分类-子分类 | VIDEO_CATEGORIES | VIDEO_CATEGORIES | 1:N (自关联) |
| 视频-标签 | VIDEOS | VIDEO_TAG_RELATIONS | 1:N |
| 标签-关联 | VIDEO_TAGS | VIDEO_TAG_RELATIONS | 1:N |
| 用户-评论 | USERS | COMMENTS | 1:N |
| 视频-评论 | VIDEOS | COMMENTS | 1:N |
| 评论-回复 | COMMENTS | COMMENTS | 1:N (自关联) |
| 用户-评分 | USERS | RATINGS | 1:N |
| 视频-评分 | VIDEOS | RATINGS | 1:N |
| 用户-笔记 | USERS | NOTES | 1:N |
| 视频-笔记 | VIDEOS | NOTES | 1:N |
| 用户-观看 | USERS | WATCH_HISTORY | 1:N |
| 视频-观看 | VIDEOS | WATCH_HISTORY | 1:N |
| 视频-资料 | VIDEOS | MATERIALS | 1:N |
| 用户-证书 | USERS | CERTIFICATES | 1:N |
| 用户-日志 | USERS | OPERATION_LOGS | 1:N |
